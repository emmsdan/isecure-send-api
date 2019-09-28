# iSecure-send-api

A simple end-to-end encrypted file sending system.

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

## API DEFINATIONS

### Refresh Database

**_GET:_** `api/refresh`

#### response

```Json
{
  message: "Database Tables refresh"
}
```

### Successful Upload

**_POST:_** `api/upload`

#### request

```Json
{
  "sender_name": "Emmanuel Daniel",
  "sender_email": "uniq@mail.org",
  "receiver_email": "example@main.com",
  "expires_in": "5m",
  // expire "5m", "1h", "12h", "1d", "3d", "5d", "7d"
  "downloads_allowed": "10",
  // downloads 1, 10, 15, 20, 25, 50, 100
  "iss_file": Blob(files)
}
```

#### response

```Json
{
    "message": "Uploaded successfully.",
    "status": "success",
    "fileInfo": {
        "url": "/74mr/6n2ou",
        "sender_name": "Emmanuel Daniel",
        "sender_email": "uniq@mail.org",
        "receiver_email": "example@main.com",
        "expires_in": "5m",
        "downloads_allowed": "10"
    }
}
```
