---
layout: post
title: Cleaning Up GamePass Games That Will Not Uninstall
date: 2021-12-16
thumbnail: cover.jpg
tags:
  - gaming
  - troubleshooting
---
{% asset_path slug %}
I have recently had a lot of trouble with the Dead by Daylight support team ignoring requests for support regarding a purchase I made that they didn't fullfil. As they will not so much as respond to my support requests, I decided it was time to just uninstall the game, accept that they won't fullfil my order or refund the money and move on.

After uninstalling the game, however, I notice that not a single MB of disk space had freed up... which was strange, as Dead by Daylight is quite a large game. I then try removing another game I am no longer playing and sure enough - no disk space is freed up.

I began to look online to find that this is not an uncommon issue; it is being reported [Time](https://answers.microsoft.com/en-us/xbox/forum/all/xbox-game-pass-for-pc-not-freeing-up-space-after/e7094bf2-b060-4803-b191-91b4466f026b) and [Time](https://answers.microsoft.com/en-us/windows/forum/all/solved-disk-space-not-freed-after-uninstalling-a/48911f57-667f-4518-875c-19f543bdf895) and [Time](https://answers.microsoft.com/en-us/xbox/forum/all/recover-disk-space-after-uninstalling-games-from/54c5eb35-0728-4fea-990a-17a010081511) again (I could keep adding more links, but you get the picture).

<hr>

**Note:** Before following the steps below, you should ensure you have used the uninstall function in Game Pass to uninstall these games (even if they do still take up disk space). This way, once we have removed the files, there will be no confusion in the Game Pass app as to whether they are installed or not.

<hr>

The initial hurdle I had, was that Windows 10 does not want you to go anywhere near the `WindowsApps` directory that games are installed in. Even if you're an administrator, you can not gain access to this directory without changing the ownership of the directory and all child objects.

<hr>

**Important Note:** there are some potential security issues in doing this, as mentioned in [This Comment](https://www.reddit.com/r/XboxGamePass/comments/ri0nfd/comment/houqojy/?utm_source=reddit&utm_medium=web2x&context=3). If you can, try to ensure you revert the ownership of any directories back to what they were, and consider changing them one by one, rather than doing it recursively to ensure you are able to note and revert the ownership and to affect no more than what is necessary.

<hr>

Rather than explain that process here, I will instead point you in the direction of point 1 of [This SuperUser Answer](https://superuser.com/a/1465362) as it is well written up and contains screenshots.

After gaining access to this directory, I could see I had an old Forza Horizon 4 directory left over taking up around 30GB of space, which I subsequently deleted. However, there were no directories for either Dead by Daylight, or Tropico 6 (another game I tested uninstalling)...

To verify both games data was still on disk, I tried to reinstall them via the Game Pass app and as expected, there was no download time, the installation went from 0% to 100% in less than a second - so the data was definitely still there, despite there not being any directories for them.

After running [WinDirStat](https://windirstat.net/), I noticed that the `MSIXVC` directory found underneath the `WindowsApps` directory was notably large. It was filled with files that used ambiguous GUIDs as names but the file sizes seemed to match up with the games from Game Pass.

After a bit more research into this directory, I got confirmation that these are in fact the games that are stored as images that are mounted at runtime (presumably some kind of anti-piracy mechanic).

There was another hurdle now, however - how do I know for sure which file is which? I had several games that were in a similar region in terms of size, so I didn't want to remove the wrong set of files.

<hr>

**Update 2021-12-17:** A user on reddit posted [This Comment](https://www.reddit.com/r/XboxGamePass/comments/ri0nfd/comment/hoxhg3g/?utm_source=reddit&utm_medium=web2x&context=3) informing me that the process described below can be done *much* easier within Windows itself. 

If you open regedit and navigate to `Computer\HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Store\ContentId` you will be able to see a full list of GUIDs and associated application / game IDs. This should eliminate any need to use Linux.

I will leave the original instructions below, in case they are of any use to anyone; but using regedit as mentioned on reddit will definitely be the easier option, so try that first to determine which files you need to remove!

<hr>

**IMPORTANT NOTE:** The next part of this involves using Linux, if you don't have a Linux installation or live CD, you may be able to achieve the same thing by installing the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install). I can't guarantee WSL has the required tools, but I'd assume it does as they are standard tools found in almost every Linux distribution available.

If your `WindowsApps` directory appears on the same drive that Windows is installed on, mounting the drive in Linux and making changes could cause problems (particularly if using fast boot) - if you're not 100% comfortable with Linux, do this at your own risk, or instead look at using WSL as mentioned above.

<hr>

At this point, I booted into my Linux partition and navigated to the `WindowsApps/MSIXVC` directory. Thankfully, as Linux doesn't care about the permissions set by Windows, there was no need to change anything around to access the files.

After seeing what data I could pull out of the GUID files in the `MSIXVC` directory, I found that the application manifests are embedded in the images. This means that it's possible to extract the name of the game stored in the image (in most cases).

To do this, open a terminal and navigate to `WindowsApps/MSIXVC`. For reference, this is what my MSIXVC directory looked like when running `ls -lah`:

```shell_session
$ ls -lah
total 152G
drwxrwxrwx 1 rob rob  568 Dec 16 00:29 .
drwxrwxrwx 1 rob rob  12K Dec 16 00:19 ..
-rwxrwxrwx 1 rob rob 9.2G Oct  9 19:56 49EDD11E-DA62-40F7-80D3-2B565FFB447A
-rwxrwxrwx 1 rob rob 5.1K Oct  9 19:56 49EDD11E-DA62-40F7-80D3-2B565FFB447A.311ED44B-274D-4FCD-AECF-13216CB4B0ED.xsp
-rwxrwxrwx 1 rob rob 4.0K Dec 16 00:23 49EDD11E-DA62-40F7-80D3-2B565FFB447A.xct
-rwxrwxrwx 1 rob rob 4.0K Dec 16 00:23 49EDD11E-DA62-40F7-80D3-2B565FFB447A.xvi
-rwxrwxrwx 1 rob rob  13K Oct  9 19:57 49EDD11E-DA62-40F7-80D3-2B565FFB447A.xvs
-rwxrwxrwx 1 rob rob  48G Dec 15 22:27 513710F5-AB8E-4D7C-9ED5-D0BA94DCFB33
-rwxrwxrwx 1 rob rob  46K Dec 15 22:27 513710F5-AB8E-4D7C-9ED5-D0BA94DCFB33.F89FFB89-EB18-4168-83E4-54DAA10D4B94.xsp
-rwxrwxrwx 1 rob rob 4.0K Dec 16 00:23 513710F5-AB8E-4D7C-9ED5-D0BA94DCFB33.xct
-rwxrwxrwx 1 rob rob  20K Dec 16 00:23 513710F5-AB8E-4D7C-9ED5-D0BA94DCFB33.xvi
-rwxrwxrwx 1 rob rob  25K Dec 15 22:28 513710F5-AB8E-4D7C-9ED5-D0BA94DCFB33.xvs
-rwxrwxrwx 1 rob rob  57G Sep  3 17:10 6269913D-D364-42F2-8F88-0434CA75D5F0
-rwxrwxrwx 1 rob rob 4.0K Dec 16 00:23 6269913D-D364-42F2-8F88-0434CA75D5F0.xct
-rwxrwxrwx 1 rob rob 4.0K Dec 16 00:23 6269913D-D364-42F2-8F88-0434CA75D5F0.xvi
-rwxrwxrwx 1 rob rob 8.9K Sep  3 17:55 6269913D-D364-42F2-8F88-0434CA75D5F0.xvs
-rwxrwxrwx 1 rob rob  36G Dec  9 20:30 8D9B5BB7-6442-4DFE-97D9-641BFB57C835
-rwxrwxrwx 1 rob rob 8.6K Dec  9 20:30 8D9B5BB7-6442-4DFE-97D9-641BFB57C835.D80FFEB9-3B8F-4D26-9D46-2FC72692730A.xsp
-rwxrwxrwx 1 rob rob 4.0K Dec 16 00:23 8D9B5BB7-6442-4DFE-97D9-641BFB57C835.xct
-rwxrwxrwx 1 rob rob 8.0K Dec 16 00:23 8D9B5BB7-6442-4DFE-97D9-641BFB57C835.xvi
-rwxrwxrwx 1 rob rob  18K Dec  9 20:33 8D9B5BB7-6442-4DFE-97D9-641BFB57C835.xvs
-rwxrwxrwx 1 rob rob 3.5G Feb 10  2021 A2239F3B-CBDD-4921-875E-C8E364379A3F
-rwxrwxrwx 1 rob rob 4.0K Dec 16 00:23 A2239F3B-CBDD-4921-875E-C8E364379A3F.xct
-rwxrwxrwx 1 rob rob 4.0K Dec 16 00:23 A2239F3B-CBDD-4921-875E-C8E364379A3F.xvi
-rwxrwxrwx 1 rob rob 3.4K Feb 10  2021 A2239F3B-CBDD-4921-875E-C8E364379A3F.xvs
-rwxrwxrwx 1 rob rob 457M Dec 15 22:29 C2A26CC6-5D55-4BA4-8340-AB7C89059118
-rwxrwxrwx 1 rob rob 4.9K Dec 15 22:29 C2A26CC6-5D55-4BA4-8340-AB7C89059118.69765BAB-534B-4BC6-8607-946D7C20FB41.xsp
-rwxrwxrwx 1 rob rob 4.0K Dec 16 00:23 C2A26CC6-5D55-4BA4-8340-AB7C89059118.xct
-rwxrwxrwx 1 rob rob 4.0K Dec 16 00:23 C2A26CC6-5D55-4BA4-8340-AB7C89059118.xvi
-rwxrwxrwx 1 rob rob  15K Dec 15 22:29 C2A26CC6-5D55-4BA4-8340-AB7C89059118.xvs
```

From the above examples, if we take `49EDD11E-DA62-40F7-80D3-2B565FFB447A` and grep the strings that can be extracted from the file by running: `strings 49EDD11E-DA62-40F7-80D3-2B565FFB447A | grep -i "Identity Name"`, we can see it is the copy of Two Point Hospital that I have installed:

```shell_session
$ strings 49EDD11E-DA62-40F7-80D3-2B565FFB447A | grep -i "Identity Name"
  <Identity Name="7904SEGAEuropeLtd.TwoPointHospital-GamePass" Publisher="CN=E92AA59E-951A-41AD-AAF4-626B69AEDBB6" Version="1.27.11.0" ProcessorArchitecture="x64" />
  <Identity Name="7904SEGAEuropeLtd.TwoPointHospital-GamePass" Publisher="CN=E92AA59E-951A-41AD-AAF4-626B69AEDBB6" Version="1.27.11.0" />
  <Identity Name="7904SEGAEuropeLtd.TwoPointHospital-GamePass" Publisher="CN=E92AA59E-951A-41AD-AAF4-626B69AEDBB6" Version="1.27.11.0" />
  <Identity Name="7904SEGAEuropeLtd.TwoPointHospital-GamePass" Publisher="CN=E92AA59E-951A-41AD-AAF4-626B69AEDBB6" Version="1.27.11.0" ProcessorArchitecture="x64" />
```

If the identity name isn't clear, we can also try looking for the display name in the manifest:

```shell_session
$ strings 49EDD11E-DA62-40F7-80D3-2B565FFB447A | grep -i "DisplayName" 
    <DisplayName>Two Point Hospital
</DisplayName>
    <PublisherDisplayName>SEGA Europe Ltd</PublisherDisplayName>
      <uap:VisualElements DisplayName="Two Point Hospital
    <Executable Name="TPH.exe" Id="Game" OverrideDisplayName="Two Point Hospital
  <ShellVisuals DefaultDisplayName="Two Point Hospital
" PublisherDisplayName="SEGA Europe Ltd" Square150x150Logo="GraphicsLogo.png" Square44x44Logo="SmallLogo.png" Description="Two Point Hospital
    <Executable Name="TPH.exe" Id="Game" OverrideDisplayName="Two Point Hospital
  <ShellVisuals DefaultDisplayName="Two Point Hospital
" PublisherDisplayName="SEGA Europe Ltd" Square150x150Logo="GraphicsLogo.png" Square44x44Logo="SmallLogo.png" Description="Two Point Hospital
    <DisplayName>Two Point Hospital
</DisplayName>
    <PublisherDisplayName>SEGA Europe Ltd</PublisherDisplayName>
      <uap:VisualElements DisplayName="Two Point Hospital
```

After you have identified that a GUID file *is* the one you want to remove, you can remove it and the extra associated files with it by running `rm GUID*`; for example, to remove Two Point Hospital, I would run: `rm 49EDD11E-DA62-40F7-80D3-2B565FFB447A*`

Repeat this as many times as needed to remove games you have uninstalled, and when you reboot back into Windows (or continue using Windows if you used WSL...), you should see the disk space is recovered and that there are no traces left of the games.

Again, manually deleting files like this can cause problems if you end up deleting the wrong thing - so be very careful and only do it if you're confident in what you're doing.

**One final note regarding the use of Linux** - there is no reason the step that uses Linux (to identify which GUID file is which game) cannot be done in Windows. I simply did not know of Windows alternatives to the `strings` and `grep` commands, which is why I switched to my Linux installation to do this. This is why I suggest that WSL should aid in this situation, because it should have those tools - there isn't any crazy magic that Linux does, it's just a way to search big files.