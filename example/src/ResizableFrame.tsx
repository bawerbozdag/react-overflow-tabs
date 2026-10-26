import { MoveHorizontal, MoveVertical } from "lucide-react";
import { useId, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useMessages } from "./i18n";

interface IResizableFrameProps {
    children: ReactNode;
    dir?: "ltr" | "rtl";
    // which size the slider controls
    axis?: "width" | "height";
}

// a slider stands in for the window being resized
export default function ResizableFrame({ children, dir, axis = "width" }: IResizableFrameProps) {
    const m = useMessages();
    const id = useId();
    const isHeight = axis === "height";
    const AxisIcon = isHeight ? MoveVertical : MoveHorizontal;
    const [size, setSize] = useState(isHeight ? 220 : 100);
    const [min, max] = isHeight ? [100, 340] : [30, 100];
    const value = isHeight ? `${size}px` : `${size}%`;

    return (
        <div className="frame-wrap">
            {/* the label names the slider; the value is announced through aria-valuetext, not as part of the name */}
            <div className="frame-control" data-keep-menu-open>
                <label htmlFor={id} className="frame-label">
                    <AxisIcon size={14} />
                    {isHeight ? m.ui.containerHeight : m.ui.containerWidth}
                </label>
                <input
                    id={id}
                    type="range"
                    name={isHeight ? "container-height" : "container-width"}
                    min={min}
                    max={max}
                    step={isHeight ? 10 : 1}
                    value={size}
                    aria-valuetext={value}
                    // the filled part of the track (see .frame-control input)
                    style={{ "--fill": `${((size - min) / (max - min)) * 100}%` } as CSSProperties}
                    onChange={(event) => setSize(Number(event.target.value))}
                />
                {/* <output> is a live region by default; it would speak on every step of a drag */}
                <output htmlFor={id} aria-live="off">
                    {value}
                </output>
            </div>

            <div className="frame" style={isHeight ? { height: size } : { width: `${size}%` }} dir={dir}>
                {children}
            </div>
        </div>
    );
}
