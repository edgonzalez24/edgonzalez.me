---
title: "Arch Linux roto: Kernel Panic - failed to read configuration 'etc/mkinitcpio.conf'"
date: 2025-11-25
description: Solución al error crítico en Arch Linux donde las imágenes initramfs no pudieron generarse (GRUB).
tags: [linux, arch-linux, opensource]
author: Edwin Gonzalez
thumbnail: https://res.cloudinary.com/dhgcfzhm0/image/upload/v1779231242/kernel-panic_kwkqwr.png
---

En este artículo documentaré cómo resolví un error crítico en Arch Linux donde el sistema no podía generar las imágenes initramfs debido a un archivo mkinitcpio.conf corrupto. En términos simples, GRUB no funcionaba correctamente para continuar con la inicialización del sistema tras una actualización de dependencias fallida.

El error principal fue:

```bash
error: fs/fshelp.c:find_file:266: file '/initramfs-linux.img' not found
```

y luego **KERNEL PANIC**!

![Kernel panic](https://res.cloudinary.com/dhgcfzhm0/image/upload/v1779231242/kernel-panic_kwkqwr.png)

## Causa del problema

Después de intentar actualizar las dependencias, por alguna razón (interrupción de la instalación, corrupción de paquetes o configuración incompleta), el archivo esencial:

```bash
/etc/mkinitcpio.conf
```

quedó dañado o modificado en el sistema, lo que hizo imposible generar un initramfs.

## Solución paso a paso

1. Acceder al chroot correctamente

Primero, montamos y accedemos al sistema instalado en el disco desde una ISO en vivo:
::warning{}
NOTA: Debes descargar y acceder desde una ISO en vivo
::
```bash
mount /dev/sdXn /mnt
mount -t proc /proc /mnt/proc
mount --rbind /sys /mnt/sys
mount --rbind /dev /mnt/dev

arch-chroot /mnt

```

2. Crear o editar manualmente `/etc/mkinitcpio.conf`

```bash
nano /etc/mkinitcpio.conf
```

Y agregué este contenido (el archivo oficial por defecto de Arch):

```conf
MODULES=()
BINARIES=()
FILES=()

HOOKS=(base udev autodetect microcode modconf kms keyboard keymap consolefont block filesystems fsck)

COMPRESSION="zstd"
COMPRESSION_OPTIONS=()

MODULES_DECOMPRESS="no"
```

3. Regenerar el initramfs

```bash
mkinitcpio -P
```

resultado
```txt
Initcpio image generation successful
```

Esto confirma que el sistema ya tiene un `initramfs-linux.img` válido.

4. Regenerar GRUB
```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

finalmente
```bash
exit
umount -R /mnt
reboot
```

Y el sistema inició sin problemas.

## Conclusión

El error "failed to read configuration `etc/mkinitcpio.conf`" generalmente indica que el archivo de configuración de mkinitcpio está ausente o corrupto.

La solución implica:

- Crear manualmente un archivo válido
- Regenerar el initramfs
- Actualizar GRUB

Documentar esto me ayudó a comprender mejor cómo funciona el proceso de arranque en Arch Linux y cómo manejar emergencias desde una ISO en vivo.


::card

**GRUB** = Gestor de arranque (Bootloader).

**initramfs** = Kit de herramientas inicial.

GRUB no crea, solo carga el initramfs.
El initramfs permite al kernel encontrar el disco y montar el sistema real.

Sin un initramfs válido → no hay arranque.
::


Ha sido un placer compartir esta experiencia contigo, ¡hasta la próxima! :)
