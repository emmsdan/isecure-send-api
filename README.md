# iSecure-send-api

I woke up one morning and decided to do "**_A simple end-to-end encrypted file sending system_**". That's why we have this project.

It has just three main feature:

- upload files and send
- control file access/download
  - download files a number of times.
  - files can't be downloaded after a particular time
- only the person sent to can access/download it.

but you can contribute to it by just raising a PR.

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

## API DEFINITIONS

### Refresh Database

**_GET:_** `api/refresh`

#### response

```Json
{
  "message": "Database Tables refresh"
}
```

### Successful Upload

**_POST:_** `api/upload`

#### request

Use the follow:

- for `expires_in`: `"5m", "1h", "12h", "1d", "3d", "5d", "7d"`
- for `downloads_allowed`: `1, 10, 15, 20, 25, 50, 100`
- for `iss_file`: `upload files to be zipped`

```Json
{
  "sender_name": "Emmanuel Daniel",
  "sender_email": "uniq@mail.org",
  "receiver_email": "example@main.com",
  "expires_in": "5m",
  "downloads_allowed": "10",
  "iss_file": "files"
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

### Download File

**_POST:_** `api/:secure_id` (secure_id = (url generated during upload))

#### response

##### Success

- should download the file

##### Error

```Json
{
  "message": "URL has expired or is invalid."
}
```
