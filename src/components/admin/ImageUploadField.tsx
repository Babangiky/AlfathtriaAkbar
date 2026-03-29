import { useRef } from "react";
import { Button, Input } from "@heroui/react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useImageUpload } from "@/src/hooks/useImageUpload";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export function ImageUploadField({ label, value, onChange, folder = "general" }: ImageUploadFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading } = useImageUpload();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, folder);
    if (url) onChange(url);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Input
            label={label}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            variant="bordered"
            placeholder="URL gambar atau upload file..."
          />
        </div>
        <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFile} />
        <Button
          isIconOnly
          variant="flat"
          color="primary"
          onPress={() => fileRef.current?.click()}
          isLoading={uploading}
          className="min-w-10 h-10"
        >
          <Upload className="w-4 h-4" />
        </Button>
      </div>
      {value && (
        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-default-200 bg-default-50">
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs">
            <ImageIcon className="w-3 h-3" />
            <span>Preview</span>
          </div>
        </div>
      )}
    </div>
  );
}
