"use client";

import { overlay } from "overlay-kit";
import { AnimatePresence, motion } from "motion/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogPortal,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/lib/components/ui/dialog";
import { Button } from "@/lib/components/ui/button";

interface ConfirmOptions {
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

interface AlertOptions {
  title?: string;
  description: string;
  confirmText?: string;
}

function PopupShell({
  isOpen,
  onClose,
  onUnmount,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUnmount: () => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogPortal forceMount>
        <AnimatePresence onExitComplete={onUnmount}>
          {isOpen && (
            <DialogPrimitive.Overlay key="popup-overlay" forceMount asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-50 bg-black/50"
              />
            </DialogPrimitive.Overlay>
          )}
          {isOpen && (
            <DialogPrimitive.Content
              key="popup-content"
              forceMount
              className="pointer-events-none fixed inset-0 z-50 grid place-items-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="bg-background pointer-events-auto grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg"
              >
                {children}
              </motion.div>
            </DialogPrimitive.Content>
          )}
        </AnimatePresence>
      </DialogPortal>
    </Dialog>
  );
}

function confirm({
  title = "확인",
  description,
  confirmText = "확인",
  cancelText = "취소",
}: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    overlay.open(({ isOpen, close, unmount }) => (
      <PopupShell
        isOpen={isOpen}
        onClose={() => {
          resolve(false);
          close();
        }}
        onUnmount={unmount}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resolve(false);
              close();
            }}
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              resolve(true);
              close();
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </PopupShell>
    ));
  });
}

function alert({
  title = "알림",
  description,
  confirmText = "확인",
}: AlertOptions): Promise<void> {
  return new Promise((resolve) => {
    overlay.open(({ isOpen, close, unmount }) => (
      <PopupShell
        isOpen={isOpen}
        onClose={() => {
          resolve();
          close();
        }}
        onUnmount={unmount}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => {
              resolve();
              close();
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </PopupShell>
    ));
  });
}

export const popup = { alert, confirm };
