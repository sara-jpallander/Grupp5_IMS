import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import clsx from "clsx";

export default function DialogWrapper({
  isOpen,
  onClose,
  onOpenChange,
  loading = false,
  title,
  description,
  children,
  className,
  footerButtons = [],
  showCancelButton = true,
  cancelButtonText = "Cancel",
}) {
  function handleClose(open) {
    if (!open) {
      if (onOpenChange) {
        onOpenChange(open);
      } else {
        onClose();
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={clsx(
          "max-w-2xl max-h-[90vh] overflow-hidden flex flex-col",
          className
        )}
      >
        <DialogHeader>
          {title && <DialogTitle className="text-xl">{title}</DialogTitle>}
          {title && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">{children}</div>

        <DialogFooter>
          {showCancelButton && (
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={loading}
            >
              {cancelButtonText}
            </Button>
          )}
          {footerButtons.map((button, index) => (
            <Button
              key={button.key || button.label || index}
              type={button.type || "button"}
              variant={button.variant || "default"}
              onClick={button.onClick}
              disabled={button.disabled || loading}
              form={button.form}
              {...button.props}
            >
              {loading && button.showLoadingWhenDisabled ? (
                <>
                  <span className="animate-spin mr-2">⚪</span>
                  {button.loadingText || button.label}
                </>
              ) : (
                button.label
              )}
            </Button>
          ))}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
