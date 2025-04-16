import { reportTypes } from "@/constants/report";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useModalStore } from "@/store/useModalStore";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { reportPost } from "@/services/post.service";
import { reportComment } from "@/services/comment.service";

export const ReportModal = () => {
  const { type, open, onClose, data } = useModalStore();

  const [reportType, setReportType] = useState<string>("SPAM");
  const [reason, setReason] = useState<string>("");

  const { mutate: report } = useMutation({
    mutationFn: (payload: { reportType: string; reason: string }) =>
      (data as { type: "post" | "comment" }).type === "post"
        ? reportPost((data as { postId: string }).postId, payload)
        : reportComment((data as { commentId: string }).commentId, payload),
    onSuccess: () => {
      toast.success("신고가 완료되었습니다.");
    },
    onError: () => {
      toast.error("신고 중 문제가 발생하였습니다.");
    },
  });

  const submitReport = () => {
    if (!reason || reason.length > 100) {
      toast.warning("신고 사유를 100자 이내로 입력해 주세요.");
      return;
    }
    report({ reportType, reason });
    onClose();
  };

  const isOpen = type === "report" && open;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card text-card-foreground rounded-lg">
        <DialogHeader>
          <DialogTitle>신고하기</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Label className="font-medium">신고 유형 선택</Label>
          <RadioGroup
            value={reportType}
            onValueChange={setReportType}
            className="grid grid-cols-2 gap-2"
          >
            {reportTypes.map((type) => (
              <Label
                key={type.value}
                htmlFor={type.value}
                className="flex items-center gap-2 cursor-pointer hover:bg-muted px-2 py-1 rounded-md"
              >
                <RadioGroupItem value={type.value} id={type.value} />
                {type.label}
              </Label>
            ))}
          </RadioGroup>

          <Label className="font-medium">신고 사유</Label>
          <Textarea
            placeholder="신고 사유를 입력해주세요. (100자 이내)"
            className="resize-none bg-input text-foreground border-border"
            maxLength={100}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => onClose()}
            className="cursor-pointer"
          >
            취소
          </Button>
          <Button onClick={submitReport}>신고 제출</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
