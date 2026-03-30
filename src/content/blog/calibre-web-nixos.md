---
title: Self-hosting my ebook collection
publishDate: 2026-03-27
description: Self-hosting ebooks on a NixOS server using Calibre Web
---

I read a lot of ebooks, but I've never been happy with the available options for
reading and syncing them across devices. For a while, the workflow I'd settled
on is the following:

- Store my ebooks in [Calibre](https://calibre-ebook.com/). Calibre allows me to
  standardize all the metadata in my ebook files, and convert between and manage
  multiple different formats.
- For reading, I either use Calibre to transfer the ebook directly to my Kobo
  ereader and read there, or open the ebook in Apple Books to get it
  synchronized between Apple devices, then read on either my iPhone or iPad.

Apple Books is the clear UX winner here, as it allows me to maintain a single
ebook collection that synchronizes books, progress, and highlights between
devices. The native reader is nice, and better than third-party ebook reader
apps. Unfortunately, like all of Apple's solutions, it is great until you have a
non-Apple device in your system. This system doesn't extend to my ereader or
Linux desktop.

I'd also prefer to manage the ebook files directly. EPUB files store their data
in plain-ish text, and with direct access to the EPUBs, searching my whole ebook
collection for a topic or keyword is trivial using `grep`. From this angle,
Calibre is the better digital book database. Ideally, I'd have a UX like Apple
Books, but self-hosted, backed by something like a Calibre database.

The dream project I'm describing doesn't exist, but there are a few projects
that are close:

- [Calibre Web](https://github.com/janeczku/calibre-web)
- [Kavita](https://www.kavitareader.com)
- [Audiobookshelf](https://www.audiobookshelf.org)

Some of them offer readers via web apps, but the web readers are clunky.
Instead, many users opt to use a feature of these applications that allows them
to self-host an [OPDS](https://opds.io) server, accessing the books with an app
that offers OPDS support. It is easy to find mobile apps that use OPDS, and my
ereader can participate as it's running [KOReader](https://koreader.rocks) which
can connect to an OPDS server. This doesn't synchronize highlights or progress,
but it's a start. Maybe these features are better done by OPDS clients rather
than the server?

I'm trying Calibre Web for now, but may switch later if I'm not happy with it.

## Setting up Calibre Web on NixOS

Declaratively managing Calibre Web is simple with NixOS. Here's my config.
`username` is a variable at the top of my nix file.

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

I'm binding to all network interfaces using `0.0.0.0`. This will allow
connections from all of my network interfaces including the
[Tailscale](https://tailscale.com/) network (for most of my devices) and my
local network (for my ereader, which can't run Tailscale). This server is
sitting in my office and not directly open to the public internet.

On devices in the Tailscale network, I just access the server directly using
`http://vexahlia:8083`. In the future I can make this nicer by putting
everything behind [Caddy](https://caddyserver.com/) and/or using [Tailscale
Serve](https://tailscale.com/docs/features/tailscale-serve).

I also added a systemd rule to ensure the directory exists on a fresh install,
with the correct owner and permissions:

```nix
systemd.tmpfiles.rules = [
  "d /srv/calibre 0775 ${username} users - -"
];
```

The library path `/srv/calibre` is meant to point to Calibre database from the
desktop app. So, to update my server collection, I wrote a script to `rsync` my
files to the server.

```bash
rsync -rhP "$HOME/Calibre Library" violet@vexahlia:/srv/calibre
```

I can run this periodically to update the collection on the server. In the
future, it might be nice to set up a cronjob to do this automatically and manage
backups.
