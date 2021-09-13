# auto-notify-pu-courses-quota

This is a small crawler to fetch remains quota of a list of courses in Providence University every 2 to 10 minutes, then send webhook when change.

## Getting Started

To get start, copy `.env.example` as `.env` and configure it.

```shell
cp .env.example .env
```

### Paramters

There are two parameters inside:

#### URL_NOTIFICATION

`URL_NOTIFICATION` is a link of ifttt webhook (or anything else to receive json webhook)

#### CORSES

`CORSES` is a comma-separated list of course ids.
