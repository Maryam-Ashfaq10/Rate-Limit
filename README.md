# Rate Limiter

A small Express.js project for implementing and experimenting with different rate limiting algorithms one by one, from scratch.

Rate limiting is a common problem in backend systems, and there are several classic algorithms for solving it, each with different trade-offs (burst tolerance, memory usage, accuracy). Instead of just using an off-the-shelf library, this repo implements each algorithm manually to understand how it actually works under the hood.

## Tech Stack

- Node.js
- Express.js

## Algorithms

## 1. Token Bucket

**How it works:**
1. Each client (e.g. by IP or id) has a "bucket" that holds a maximum number of tokens.
2. Tokens are added to the bucket at a fixed refill rate over time.
3. Every incoming request consumes one token.
4. If the bucket has no tokens left, the request is rejected until it refills.

## 2. Fixed Window

**How it works:**
1. Time is divided into fixed-size windows (e.g. every 60 seconds).
2. Each window has a counter that starts at 0.
3. When a request arrives, the current window is identified based on the timestamp and the counter for that window is incremented by 1.
4. If the counter exceeds the limit, the request is rejected.


