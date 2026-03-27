---
title: Setting up Calibre Web on NixOS
publishDate: 2026-03-27
description: ???
draft: true
---

I read a lot of ebooks, but I've never been a fan of the available options for
both reading and syncing them across devices. For a while, the workflow I've
settled on is opening the ebooks in Apple Books and reading on either my iPhone
or iPad. Apple Books is genuinely great, but committing to Apple's solution
locks my ebooks out of the rest of my devices: I can't access them on a linux
desktop or on my Kobo ereader.

`username` is a variable which is declared to the top of my nix config.

```nix
services.calibre-web = {
  enable = true;
  user = username;
  listen.ip = "0.0.0.0";
  options = {
    calibreLibrary = "/srv/calibre";
    enableBookUploading = true;
  };
};
```

```nix
systemd.tmpfiles.rules = [
  "d /srv/calibre 0775 ${username} users - -"
];
```
