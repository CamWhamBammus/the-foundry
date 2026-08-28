"use client";

import { useState } from "react";
import { Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StartProjectModal } from "./StartProjectModal";

export function EmptyFoundryState({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-md py-16">
      <EmptyState icon={Gamepad2} message="Nothing on the bench right now." />
      <div className="mt-4 flex justify-center">
        <Button onClick={() => setOpen(true)}>Start a new project</Button>
      </div>
      <StartProjectModal open={open} onClose={() => setOpen(false)} onCreated={onCreated} />
    </div>
  );
}
