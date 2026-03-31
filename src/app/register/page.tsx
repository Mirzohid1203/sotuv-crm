"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      
      // Initialize basic user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: new Date(),
        role: "admin", // Assuming first user is the business owner
      });
      
      router.push("/dashboard");
    } catch (err: any) {
       let uzError = err.message;
       if (err.code === "auth/email-already-in-use") {
         uzError = "Ushbu email bilan allaqachon ro'yxatdan o'tilgan";
       } else if (err.code === "auth/weak-password") {
         uzError = "Parol juda zaif (kamida 6 ta belgi bo'lishi kerak)";
       }
      setError(uzError || "Ro'yxatdan o'tishda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-none ring-1 ring-gray-200/50">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto bg-indigo-100 p-3 rounded-xl w-fit">
            <Briefcase className="h-8 w-8 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Ro'yxatdan o'tish</CardTitle>
          <CardDescription>Sotuvlaringizni bugundan boshqarishni boshlang</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">{error}</div>}
            <Input
              label="To'liq Ism"
              type="text"
              placeholder="Falonchi Pistonchiyev"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Manzili"
              type="email"
              placeholder="ism@kompaniya.uz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Parol"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
              {isLoading ? "Ro'yxatdan o'tilmoqda..." : "Ro'yxatdan o'tish"}
            </Button>
            <div className="text-sm text-center text-gray-500">
              Profilingiz bormi?{" "}
              <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Kirish
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

