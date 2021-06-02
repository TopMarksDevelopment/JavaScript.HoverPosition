# Hover Position (A JavaScript package)

A small package to help position a floating element. This can be positioned relative to another element or to a mouse event.

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
document.addEventListener("mousemove", function(e){
    const target = document.getElementById("Target"),
        position = new HoverPosition(
            {
                anchor: document.getElementById("Anchor"),
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

### `my`

The location of the `target` to position from

**Type:** `PositionAlignment`

### `at`

The location of the `anchor` to position to

**Type:** `PositionAlignment` | `PositionAlignment` |

### `anchor`

**Type:** `HTMLElement` OR `MouseEvent` | The element or mouse event to calculate against

### `target`

**Type:** `HTMLElement` | The target that we're going to be positioning

### `collision` - Optional

How to handle any collisions.

**Type:** `"bestFit"` OR `"flipfit"` OR `"ignore"` |

-   bestFit
    -   This will find the best fit before trying to flip the element
-   flipFit
    -   This will flip the element completely vertically and horizontally
-   ignore
    -   This will just ignore any collisions and place the element exactly where you wanted it

### `bestFitPreference` - Optional

When `collision` is set to `bestFit`, this is the preferred "best" direction

**Type:** `"horizontal"` OR `"vertical"`

### `defaults` - Optional

This has two uses.

1. If only `"top"` is suppled to `my`, `my`'s horizontal position is fetched from here
2. If you are allowing `at` or `my` to be parsed from an untrusted source then this allows you to fall back to a default

**Type:** `{ my: CombinedAlignment; at: CombinedAlignment }`

#### The `CombinedAlignment` property

The `CombinedAlignment` is a combination of vertical and horizontal alignments.

Strings that match this are:

-   "top center"
-   "top left"
-   "top right"
-   "center center"
-   "center left"
-   "center right"
-   "bottom center"
-   "bottom left"
-   "bottom right"

#### The `PositionAlignment` property

The `PositionAlignment` is an extension of the `CombinedAlignment` property but it also allows just a vertical or horizontal alignment to be passed to it.

So, as well as those above, it will also allow:

-   "top"
-   "bottom"
-   "center"
-   "left"
-   "right"

## Changes

You can see all the changes in our [change log](./ChangeLog)

## License

This extension is licensed under the [MIT License](./License)