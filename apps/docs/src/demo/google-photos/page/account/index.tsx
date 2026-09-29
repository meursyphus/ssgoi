"use client";

import { useState } from "react";
import { CloudCheck, CloudOff, HardDrive, X } from "lucide-react";
import { BASE } from "@/demo/google-photos/page/shared/paths";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { BackupSwitch } from "./backup-switch";

const STORAGE = { usedGb: 9.2, totalGb: 15 };
const BACKED_UP_ITEMS = 1284;

/**
 * Account sheet from the avatar. Only things that act in place: the backup
 * switch. Storage is a read-only meter.
 */
export default function AccountPage() {
  const [backup, setBackup] = useState(true);
  const usedPct = Math.round((STORAGE.usedGb / STORAGE.totalGb) * 100);

  return (
    <div className="block min-h-full bg-[#F0F4F9] px-3 pb-10">
      <header className="relative flex h-14 items-center justify-center">
        <DemoBackLink
          fallback={BASE}
          aria-label="Close"
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 active:bg-black/[0.06]"
        >
          <X className="h-5 w-5" />
        </DemoBackLink>
        <div className="flex items-center gap-2">
          <img
            src="/google-photos-icon.svg"
            alt=""
            width={22}
            height={22}
            className="h-[22px] w-[22px]"
          />
          <span className="text-[16px] font-medium text-neutral-700">
            Google Photos
          </span>
        </div>
      </header>

      <div className="overflow-hidden rounded-[28px] bg-white">
        <div className="flex items-center gap-3 px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A73E8] text-[16px] font-semibold text-white">
            D
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-medium text-neutral-900">
              Demo user
            </p>
            <p className="truncate text-[13px] text-neutral-500">
              you@example.com
            </p>
          </div>
        </div>

        <div className="mx-5 h-px bg-neutral-100" />

        <div className="flex items-center gap-4 px-5 py-4">
          {backup ? (
            <CloudCheck className="h-5 w-5 shrink-0 text-[#1A73E8]" />
          ) : (
            <CloudOff className="h-5 w-5 shrink-0 text-neutral-500" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium text-neutral-900">
              {backup ? "Backup complete" : "Backup is off"}
            </p>
            <p className="text-[13px] text-neutral-500">
              {backup
                ? `${BACKED_UP_ITEMS.toLocaleString()} items backed up`
                : "New photos stay on this device only"}
            </p>
          </div>
          <BackupSwitch checked={backup} onChange={setBackup} label="Backup" />
        </div>

        <div className="flex gap-4 px-5 pb-5 pt-1">
          <HardDrive className="mt-0.5 h-5 w-5 shrink-0 text-neutral-600" />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium text-neutral-900">
              Account storage
            </p>
            <p className="text-[13px] text-neutral-500">
              {STORAGE.usedGb} GB of {STORAGE.totalGb} GB used
            </p>
            <div
              role="meter"
              aria-label="Storage used"
              aria-valuenow={usedPct}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-200"
            >
              <div
                className="h-full rounded-full bg-[#1A73E8]"
                style={{ width: `${usedPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <p className="px-5 pt-4 text-center text-[12px] leading-relaxed text-neutral-500">
        Photos and videos you back up use your Google Account storage.
      </p>
    </div>
  );
}
