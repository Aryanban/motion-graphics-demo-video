// Root - registers the master composition and one debug composition per scene.

import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadDisplay } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadEditorial } from "@remotion/google-fonts/RobotoSlab";
import { Composition } from "remotion";
import { Master } from "./Master";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2AuditHUD } from "./scenes/Scene2AuditHUD";
import { Scene3VisualSoM } from "./scenes/Scene3VisualSoM";
import { Scene4ASTPayoff } from "./scenes/Scene4ASTPayoff";
import { Scene5ClosingCTA } from "./scenes/Scene5ClosingCTA";
import { SubClock } from "./SubClock";
import { canvas } from "./theme";
import { FPS, SCENES, TOTAL_FRAMES } from "./timing";

// Authentic typography loading for AEOForge
loadDisplay("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
loadMono("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });
loadEditorial("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

/** The film with no sound, on the shutter's clock. tools/mb renders this for real motion blur. */
const MasterSub: React.FC<{ times: number[] | null }> = ({ times }) => (
  <SubClock times={times}>
    <Master sfx={false} music={false} />
  </SubClock>
);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Master"
      component={Master}
      defaultProps={{ sfx: true }}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={canvas.width}
      height={canvas.height}
    />

    {/* The same film with the music only */}
    <Composition
      id="Master-NoSfx"
      component={Master}
      defaultProps={{ sfx: false }}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={canvas.width}
      height={canvas.height}
    />

    {/* Motion blur sub-shutter */}
    <Composition
      id="Master-Sub"
      component={MasterSub}
      defaultProps={{ times: null as number[] | null }}
      calculateMetadata={({ props }) => ({
        durationInFrames: props.times ? Math.max(TOTAL_FRAMES + 1, props.times.length) : TOTAL_FRAMES,
      })}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={canvas.width}
      height={canvas.height}
    />

    {/* Individual scene debug compositions */}
    <Composition
      id="Scene-Hook"
      component={Scene1Hook}
      durationInFrames={SCENES.hook.duration}
      fps={FPS}
      width={canvas.width}
      height={canvas.height}
    />

    <Composition
      id="Scene-AuditHUD"
      component={Scene2AuditHUD}
      durationInFrames={SCENES.auditHud.duration}
      fps={FPS}
      width={canvas.width}
      height={canvas.height}
    />

    <Composition
      id="Scene-VisualSoM"
      component={Scene3VisualSoM}
      durationInFrames={SCENES.visualSom.duration}
      fps={FPS}
      width={canvas.width}
      height={canvas.height}
    />

    <Composition
      id="Scene-ASTPayoff"
      component={Scene4ASTPayoff}
      durationInFrames={SCENES.astPayoff.duration}
      fps={FPS}
      width={canvas.width}
      height={canvas.height}
    />

    <Composition
      id="Scene-ClosingCTA"
      component={Scene5ClosingCTA}
      durationInFrames={SCENES.closingCta.duration}
      fps={FPS}
      width={canvas.width}
      height={canvas.height}
    />
  </>
);
