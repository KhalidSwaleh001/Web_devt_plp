 Day 7 Assignment: Scaling a Photo-Sharing App

 1. Overview and Assumptions

SnapShare is a photo-sharing application where users upload photos and view feeds containing photos from people they follow. The system must support millions of users while ensuring fast photo delivery, reliable uploads, and efficient storage.

 Given Facts

- Registered users: 10,000,000
- Daily active users: 10% of registered users
- Uploads per active user: 1 photo per day
- Feed views per active user: 50 pages per day
- Average original photo size: 2 MB
- Average thumbnail size: 50 KB
- Seconds per day: 86,400
- Peak feed traffic: 5 times average traffic

 Additional Assumptions

- Each active user uploads one photo per day.
- Each uploaded photo produces one thumbnail.
- Average traffic is calculated over 24 hours.
- Peak feed traffic is five times the average rate.
- Peak uploads are estimated at five times the average rate for capacity planning.
- One year contains 365 days.
- Decimal storage units are used: 1 TB = 1,000,000 MB.
- Storage estimates exclude backups, replicas, database metadata, and temporary files.

 2. Traffic and Storage Calculations

 Daily Active Users

Daily active users = Registered users × Daily activity percentage

= 10,000,000 × 0.10

= 1,000,000 daily active users

Photo Uploads

Daily uploads = 1,000,000 × 1

= 1,000,000 uploads per day

Average uploads per second:

= 1,000,000 ÷ 86,400

= 11.57 uploads per second

Estimated peak uploads per second:

= 11.57 × 5

= 57.87 uploads per second

 Feed Views

Daily feed views = 1,000,000 × 50

= 50,000,000 feed views per day

Average feed views per second:

= 50,000,000 ÷ 86,400

= 578.70 feed views per second

Peak feed views per second:

= 578.70 × 5

= 2,893.52 feed views per second

Therefore, SnapShare should plan for approximately 2,894 feed views per second during peak traffic.

 Annual Storage Requirements

Original photo storage per day:

= 1,000,000 × 2 MB

= 2,000,000 MB = 2 TB

Original photo storage per year:

= 2 TB × 365

= 730 TB per year

Thumbnail storage per day:

= 1,000,000 × 50 KB

= 50,000,000 KB = 50 GB

Thumbnail storage per year:

= 50 GB × 365

= 18.25 TB per year

Total annual photo and thumbnail storage:

= 730 TB + 18.25 TB

= 748.25 TB per year

This estimate assumes photos are not deleted and excludes backups, replicas, database metadata, and other storage overhead. Actual storage capacity requirements will be higher when these are included.

 3. Is SnapShare Read-Heavy or Write-Heavy?

SnapShare is a read-heavy system because it handles 50 million feed views per day compared with one million photo uploads per day. This represents approximately 50 feed views for every upload.

The architecture should prioritize fast reads by using a Content Delivery Network (CDN), caching frequently accessed data, and a database read replica. Uploads must also remain reliable, with background processing used for tasks such as thumbnail generation to prevent unnecessary delays.

 4. Where Should Photos Be Stored?

Photos should be stored in object storage rather than directly inside the relational database.

Object storage is designed to store large files efficiently and scale to very large capacities. It also supports durable storage, access controls, and integration with a CDN.

The database should store photo metadata, including the photo ID, owner ID, caption, upload timestamp, processing status, and object storage key. This keeps database records smaller and allows the application to retrieve photo information without transferring large image files through the database.

5. Architecture Diagram


                         USERS
                           |
                           v
                  +------------------+
                  |       CDN        |
                  | Cache and deliver|
                  | photos/thumbnails|
                  +------------------+
                           |
                           v
                  +------------------+
                  |  Load Balancer   |
                  +------------------+
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
       +-----------+ +-----------+ +-----------+
       | App Server| | App Server| | App Server|
       |     1     | |     2     | |     3     |
       +-----------+ +-----------+ +-----------+
             |             |             |
             +-------------+-------------+
                           |
               +-----------+-----------+
               |           |           |
               v           v           v
         +-----------+ +-----------+ +----------------+
         |   Cache   | |  Primary  | | Object Storage |
         |  (Redis)  | | Database  | | Original Photos|
         +-----------+ +-----+-----+ | and Thumbnails |
                           |         +----------------+
                           v
                     +-----------+
                     | Database  |
                     |   Read    |
                     |  Replica  |
                     +-----------+

                  UPLOAD PROCESSING

                     App Server
                          |
                          v
                     +-----------+
                     | Job Queue |
                     +-----------+
                          |
                          v
                  +------------------+
                  | Thumbnail Worker |
                  +------------------+
                          |
                          v
                  +------------------+
                  | Object Storage   |
                  | Save Thumbnail   |
                  +------------------+


 6. Components and the Problems They Solve

1. CDN: Caches and delivers photos and thumbnails from locations closer to users, reducing latency and bandwidth consumption at the origin.
2. Load balancer: Distributes incoming application requests across healthy app servers to prevent individual servers from becoming overloaded.
3. App servers: Handle authentication, upload authorization, feed requests, photo metadata, and application business logic.
4. Cache (Redis): Stores frequently accessed feed data and metadata to reduce repeated database queries and improve response times.
5. Primary database: Stores authoritative records such as users, followed accounts, photo metadata, and feed relationships.
6. Database read replica: Handles suitable read queries to reduce the workload on the primary database and improve read scalability.
7. Object storage: Stores original photos and generated thumbnails independently of the database, supporting large-scale file storage.
8. Job queue: Holds thumbnail-generation jobs so that uploads do not have to wait for image processing to finish.
9. Thumbnail worker: Retrieves queued jobs, generates thumbnails, saves them to object storage, and updates their processing status.

 7. Photo Upload Flow

1. A user selects a photo and submits it through the SnapShare application.
2. The app server authenticates the user, checks upload permissions, and validates the file type and size.
3. The application provides an authorized upload destination, such as a short-lived pre-signed object storage URL.
4. The client uploads the original photo directly to object storage, reducing the amount of file data passing through the app server.
5. After the upload succeeds, the application records the photo metadata and object storage key in the primary database.
6. The application places a thumbnail-generation job in the queue.
7. A thumbnail worker retrieves the job, downloads the original photo, generates a thumbnail targeting approximately 50 KB, and saves it to object storage.
8. The worker updates the photo's processing status to indicate that the thumbnail is ready.
9. The application makes the photo available in the feed when the required metadata and thumbnail are ready.
10. The CDN caches and delivers the original photo and thumbnail to users who request them.

The system should support retries, monitoring, and idempotent job processing so that temporary failures do not permanently lose work or produce inconsistent results.

 8. Trade-Offs

 Trade-Off 1: CDN Caching vs. Freshness

A CDN improves photo delivery speed and reduces bandwidth costs, but cached content can become stale when photos are changed or deleted. Versioned object keys and appropriate cache-control settings improve freshness but introduce additional cache-management complexity.

 Trade-Off 2: Read Replicas vs. Data Consistency

Read replicas reduce the workload on the primary database, but replication lag can cause newly uploaded photos or updated metadata to be temporarily absent from replica-based queries. Critical read-after-write requests can be sent to the primary database, although this increases its workload.

 Trade-Off 3: Asynchronous Processing vs. Immediate Availability

A job queue allows uploads to finish without waiting for thumbnail generation, improving responsiveness. However, thumbnails may not be immediately available, so the application needs processing-status indicators, retries, and a way to recover failed jobs.

 Trade-Off 4: Object Storage vs. Operational Complexity

Object storage scales efficiently for large photo collections, but the application must manage upload permissions, object keys, lifecycle policies, and access security separately from database records.

## 9. Conclusion

SnapShare should use a horizontally scalable architecture consisting of a CDN, load balancer, multiple app servers, Redis caching, a primary database with a read replica, object storage, and an asynchronous thumbnail-processing queue.

The estimated workload is one million uploads and 50 million feed views per day, with approximately 2,894 feed views per second at peak. Original photos and thumbnails require approximately 748.25 TB of additional storage annually before backups, replicas, and other overhead are considered.

This design prioritizes read performance, stores large files outside the database, and uses background workers to process thumbnails. Monitoring, autoscaling, secure uploads, and reliable job processing are important for operating the system at this scale.
