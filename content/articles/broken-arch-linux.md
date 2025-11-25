---
title: "Broken Arch Linux: Kernel Panic - failed to read configuration 'etc/mkinitcpio.conf"
date: 2025-11-25
description: Solution to the critical error in Arch Linux - Kernel Panic - initramfs images could not be generated (GRUB).
tags: [linux, arch-linux, opensource]
author: Edwin Gonzalez
thumbnail: /articles/broken-arch-linux/kernel-panic.png
---

In this article, I will document how I resolved a critical error on Arch Linux where the system failed to generate initramfs images due to a corrupted mkinitcpio.conf file. In simpler terms, GRUB was not functioning correctly to proceed with system initialization after a faulty dependency upgrade.

The main error was:

```bash
error: fs/fshelp.c:find_file:266: file '/initramfs-linux.img' not found
```

and then **KERNEL PANIC**!

![Kernel panic](https://oqaztlycxyasqifonfwp.supabase.co/storage/v1/object/public/website/articles/broken-arch-linux/kernel-panic.png)

## Cause of the problem

After attempting to upgrade dependencies, for some reason (installation interruption, package corruption, or incomplete configuration), the essential file:

```bash
/etc/mkinitcpio.conf
```

It was damaged/modified in the system, which made it impossible to generate an initramfs.

## Step by step solution

1. Enter the chroot correctly

First, we mount and access the system we have installed on our disk from a live iso
::warning{}
NOTE: You must to download and access from a live ISO
::
```bash
mount /dev/sdXn /mnt
mount -t proc /proc /mnt/proc
mount --rbind /sys /mnt/sys
mount --rbind /dev /mnt/dev

arch-chroot /mnt

```

2. Manually create or edit  `/etc/mkinitcpio.conf`

```bash
nano /etc/mkinitcpio.conf
```

And I added this content (the official default Arch file):

```conf
MODULES=()
BINARIES=()
FILES=()

HOOKS=(base udev autodetect microcode modconf kms keyboard keymap consolefont block filesystems fsck)

COMPRESSION="zstd"
COMPRESSION_OPTIONS=()

MODULES_DECOMPRESS="no"
```

3. Regenerate the initramfs

```bash
mkinitcpio -P
```

result
```txt
Initcpio image generation successful
```

This confirms that the system already has a valid `initramfs-linux.img`.

4. Regenerate GRUB
```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

finally
```bash
exit
umount -R /mnt
reboot
```

And the system started up without problems.

## Conclusion

The error “failed to read configuration `etc/mkinitcpio.conf`” usually indicates that the mkinitcpio configuration file is missing or corrupted.

The solution involves:

- Manually creating a valid file
- Regenerating the initramfs
- Updating GRUB

Documenting this helped me better understand how the boot process works in Arch Linux and how to handle emergencies from a Live ISO.


::card

**GRUB** = Bootloader.

**initramfs** = Initial toolkit.

GRUB doesn't create, it only loads the initramfs.
The initramfs allows the kernel to find the disk and mount the actual system.

Without a proper initramfs → no boot.
::


It has been a pleasure to share this experience with you, see you next time!!. :)
