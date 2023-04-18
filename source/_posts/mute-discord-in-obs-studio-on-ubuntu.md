---
title: How to Mute Discord in OBS on Ubuntu 22.10
date: 2023-04-17 22:28:00
thumbnail: cover.jpeg
tags:
  - gaming
  - linux
  - streaming
---
If you like to stream gameplay footage to platforms like Twitch, there's a good chance you've run into a very common issue: being unable to join voice chat in order to respect the privacy of others who may not want to be heard on stream.

## The [Defacto] Windows / macOS Solution
As OBS picks up any audio going through to the selected audio device, there is no means of it filtering audio from specific applications. There is a some what widely known solution to this for Windows and macOS users that can be achieved by using [VB-Cable](https://vb-audio.com/Cable/).

VB-Cable works by allowing you to setup a virtual audio device which can then be listened to via your physical audio device. By doing this, it means you can configure your game to output to the virtual audio device and tell OBS to record audio from _that_ device instead of your physical one. As your physical device plays back what is being received by the virtual device, however, you are still able to hear everything. Providing you leave Discord (or any other application, for that matter) to output via the physical audio device, rather than the virtual one, then OBS will be unable to hear anything output by Discord.

## The Linux Solution
Unfortunately, VB-Cable [at the time of writing] is only available on Windows and macOS; **but** - if you are using a Linux distribution that is utilising PipeWire, there is a built in solution!

As of Ubuntu 22.10, PipeWire is the default audio server and is also now the default audio server for Fedora and Pop! OS. If you're unsure if the distro you are using uses PipeWire, take a quick look at your running processes:

```
$ ps x | grep pipewire
   2263 ?        S<sl   1:19 /usr/bin/pipewire
   2266 ?        S<sl   2:26 /usr/bin/pipewire-pulse
```

Providing you are using PipeWire, you can create a new virtual device that will output to your default audio output by opening a terminal and running:

```bash
pw-loopback -m '[ FL FR]' --capture-props='media.class=Audio/Sink'
```

After running `pw-loopback`, you should now see a new audio playback device available in your settings, as can be seen in the below screenshot (see device `pw-loopback-41686`):

{% asset_img pipewire-loopback.jpg %}

Now, as the `Line Out` device is my default audio output device, any audio that is sent to `pw-loopback-41686` will be audible through `Line Out`, but audio going via `Line Out` will not be audible through `pw-loopback-41686`.

It is worth noting, if you close the terminal that is running `pw-loopback`, the device will no longer be available, you need to leave `pw-loopback` running for the duration of your stream.

Next, head over to OBS, and click the ellipsis button for `Desktop Audio` in the Audio Mixer section (or whichever output you have chosen to monitor) and click `Properties`.

{% asset_img obs-audio-mixer.jpg %}

In the dialog window that is now displayed, ensure you choose the loopback device that was created by `pw-loopback` and hit OK.

{% asset_img audio-properties-obs.jpg %}

Congratulations, OBS will now only record applications that are outputting audio to the loopback device!

Unfortunately, some games will not allow you to choose a playback device to use, and will instead use the default audio device instead. There is, however, a way around this too! Open your audio settings and take a look around for the playback streams. For each stream that appears, you will be able to choose which audio sink should be used. Simply find the playback stream for the game you are playing and select the `pw-loopback` device created earlier and the audio will now be piped to it rather than the default:

{% asset_img output-override.jpg %}