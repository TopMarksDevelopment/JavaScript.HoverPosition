# Hover Position (A JavaScript package)

A small package to help position a floating element. This can be positioned relative to another element or to a mouse event.

### Links
- [Options](#options)
- [Change log](./CHANGELOG.md)
- [License (MIT)](./LICENSE)

## Usage

If you want to position an element to another fixed element then you can use the sample below

```TS
return new HoverPosition(
    {
        anchor: document.getElementById("Anchor"),
        target: document.getElementById("Target"),
        my: "top center",
        at: "bottom center",
    }
);
```

If you'd rather position the element to the mouse's movement then you can use the sample below

> ⚠ It is recommended to debounce the below sample, just to prevent performance issues

```TS
document.addEventListener("mousemove", function(mouse){
    const target = document.getElementById("Target"),
        pos = new HoverPosition(
            {
                anchor: mouse,
                target: target,
                my: "top center",
                at: "bottom center",
            }
        );

    target.style.top = pos.top;
    target.style.left = pos.left;
});
```

## Options

Option | Type | Default | Details
---|---|---|---
<a id="options-my">`my`</a> | [`PositionAlignment`](#The-PositionAlignment-property) | N/A | The location on the `target` to position from
<a id="options-at">`at`</a> | [`PositionAlignment`](#The-PositionAlignment-property) | N/A | The location on the `anchor` to position against
<a id="options-anchor">`anchor`</a> | `HTMLElement` OR `MouseEvent` | N/A | The element or mouse event to anchor our target to
<a id="options-target">`target`</a> | `HTMLElement` | N/A | The target that we're going to be positioning
<a id="options-collision">`collision?`</a> | [`PositionCollision`](#The-PositionCollision-property) | `bestFit` | How to handle collisions with the window edge
<a id="options-bestFitPreference">`bestFitPreference?`</a> | `horizontal` OR `vertical` | `horizontal` | This is the preferred "best" direction when `collision = bestFit` and there is a "best fit" horizontally and vertically
<a id="options-defaults">`defaults?`</a> | `{ my: PositionAlignment; at: PositionAlignment }` | `my: "top center", at: "bottom center"` | The fallback when only one property is supplied or the property supplied is invalid

## The `PositionAlignment` property

The `PositionAlignment` will allow any of the below, plus a combination in the form `vertical horizontal` (e.g. `top center`, `bottom right` or `center left`)

-   "top"
-   "bottom"
-   "center"
-   "left"
-   "right"

## The `PositionCollision` property

- `bestFit`
    - This will find the closest fit before trying to flip the element
- `flipFit`
    - This will flip the element completely vertically and horizontally
- `ignore`
    - This will just ignore any collisions and place the element exactly where you wanted it
