"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth, storage } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Upload, User, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsUploading(true);
    setSuccessMsg("");

    try {
      let photoURL = user.photoURL;

      if (file) {
        // Upload to Firebase Storage
        const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL
      });

      setSuccessMsg("Profil muvaffaqiyatli yangilandi!");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500 space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Sozlamalar</h1>
        <p className="text-sm text-gray-500 mt-1">Hisobingiz va profilingizni boshqaring.</p>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-gray-200/50">
        <CardHeader>
          <CardTitle>Profil Ma'lumotlari</CardTitle>
          <CardDescription>Suratingiz va shaxsiy ma'lumotlaringizni yangilang.</CardDescription>
        </CardHeader>
        <CardContent>
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 flex items-center gap-2 rounded-md border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 border-2 border-indigo-200 overflow-hidden relative group cursor-pointer">
                  {user?.photoURL || file ? (
                     <img 
                       src={file ? URL.createObjectURL(file) : user?.photoURL!} 
                       alt="Avatar" 
                       className="h-full w-full object-cover" 
                     />
                  ) : (
                    <User className="h-10 w-10 opacity-50" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-center text-gray-500 mt-2">Yuklash uchun bosing</p>
              </div>
              
              <div className="flex-1 space-y-4 w-full">
                <Input 
                  label="Ko'rinadigan Ism" 
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                />
                
                <Input 
                  label="Email Manzili (O'zgartirib bo'lmaydi)" 
                  value={user?.email || ""}
                  disabled
                  className="bg-gray-50 text-gray-500"
                />

                <Button type="submit" disabled={isUploading} className="mt-4">
                  {isUploading ? "Saqlanmoqda..." : "Profilni Saqlash"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-sm ring-1 ring-red-200/50 bg-red-50/20">
        <CardHeader>
          <CardTitle className="text-red-700">Xavfli Hudud</CardTitle>
          <CardDescription>Hisobingiz bilan bog'liq qaytarib bo'lmaydigan amallar.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="danger">
            Hisobni O'chirish
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

