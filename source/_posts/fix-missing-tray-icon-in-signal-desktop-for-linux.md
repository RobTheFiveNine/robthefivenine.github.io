---
layout: post
title: Fix Missing Tray Icon in Signal Desktop for Linux
date: 2021-09-18
thumbnail: signal.png
tags:
  - troubleshooting
---
As of September, 2021, the Signal desktop application does not currently expose a setting in the GUI to minimise the application to the system tray. However, this functionality is available via the CLI arguments as can be seen documented in [This Thread](https://github.com/signalapp/Signal-Desktop/issues/1965) and [This One](https://github.com/signalapp/Signal-Desktop/issues/2210).

It does seem to have been added in the beta build as per [This Post](https://github.com/signalapp/Signal-Desktop/issues/2210#issuecomment-872330273):

> We've added "official" system tray support to the latest beta! Please give it a try and report bugs here on GitHub or [on the community forum](https://community.signalusers.org/t/beta-feedback-for-the-upcoming-desktop-5-8-release/34577).
> 
> If you're not already on the beta, you can install it side-by-side with the production version. [Click here for instructions on how to get started with the beta.](https://support.signal.org/hc/articles/360007318471-Signal-Beta)
> 
> Some details about this feature:
> 
> * It is available for Windows and Linux. Go to Signal's settings to enable "minimize to system tray" or "start minimized to tray".
> * These settings are off by default. We may enable them by default in the future, but have no immediate plans to do so.
> * If everything goes smoothly in beta (i.e., no significant bugs), we'll release it to production Windows users in our next production version.
> * Because [Linux system tray support is quirkier](https://www.electronjs.org/docs/api/tray#class-tray), it will stay in beta for a little while before we make it available to all users—we want to make sure it works well for most people. I don't have an ETA for when production Linux users will get system tray support.
> * The `--use-tray-icon` and `--start-in-tray` command line arguments will continue to work on all 3 platforms. These CLI flags take precedence over settings you choose in the UI. It's possible we'll remove these command line arguments in the future, but we have no plans to do so, as it doesn't significantly increase our maintenance burden.
> 
> For posterity, we added system tray support in [af1f2ea](https://github.com/signalapp/Signal-Desktop/commit/af1f2ea44927d92327acda3f20503e7715d4dd89) and [8b30fc1](https://github.com/signalapp/Signal-Desktop/commit/8b30fc17cded16cc7d98f6ebcdd8e5a340d580a5).

In the meantime, if you don't want to upgrade to using the beta build, you can add the required CLI arguments by updating the `Exec` property in `/usr/share/applications/signal-desktop.desktop` to include `--use-tray-icon`.

One caveat when doing this, is that updates to Signal appear to revert this change. One way of working around this (albeit a slightly hacky way), is to make use of the `cron.hourly` tasks.

Create a file in `/etc/cron.hourly` named `fix-signal-taskbar` with the following content:

```bash
#!/bin/sh

sed -i 's/signal-desktop --no-sandbox %U/signal-desktop --use-tray-icon --no-sandbox %U/g' /usr/share/applications/signal-desktop.desktop
```

Then, run `chmod +x /etc/cron.hourly/fix-signal-taskbar` to ensure it is executable.

You can then verify that the script will be executed by using `run-parts`. Running the command `run-parts --test /etc/cron.hourly` should list all the scripts that will be executed hourly; included in that should be `/etc/cron.hourly/fix-signal-taskbar`.