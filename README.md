# Geopins Udemy App

Current Functionality 2/10.

Configured minimal client and server for OAuth and storing User data with MongoDB.

Context and Interceptor workflow.

1. Login - asks for user data after successful Google login.
2. Server - intercept the request made within context (server.js)
3. Validate the ID token by verifying it (findOrCreateUser()).
4. Get back the User data from Google.
5. Find or Create new User based on user data and db check(email).
6. If found, simply return the user object.
7. If not, createNewUser with googleUser data object.
8. User context is now returned successfully in Apollo Server.
9. Using the authenticated resolver, we can wrap gql operations with context.
