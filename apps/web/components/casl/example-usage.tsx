// apps/frontend/src/casl/example-usage.tsx — not wired up, just usage reference

import React from "react";
import { Can, useAbility } from "./AbilityProvider";

function GradeRowActions({ grade }: { grade: { id: string; classId: string } }) {
  const ability = useAbility();

  return (
    <div>
      {/* Declarative — hides the button entirely if not allowed */}
      <Can I="update" a="Grade">
        <button>Modifier</button>
      </Can>

      {/* Imperative — same rule, useful for conditions beyond JSX rendering,
          e.g. disabling a route navigation or an API call attempt */}
      {ability.can("delete", "Grade") && <button>Supprimer</button>}
    </div>
  );
}
