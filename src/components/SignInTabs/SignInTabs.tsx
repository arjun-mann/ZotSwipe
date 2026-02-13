"use client";

import { useState } from "react";

import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

type AuthType = "Sign In" | "Sign Up";

function SignInCard({ authType }: { authType: AuthType }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailAuth = async () => {
    try {
      const authFunc =
        authType === "Sign In"
          ? signInWithEmailAndPassword
          : createUserWithEmailAndPassword;
      await authFunc(auth, email, password);
      setError("");
    } catch (error) {
      console.error(`Error trying to ${authType.toLowerCase()}:`, error);
      setError(
        `Failed to ${authType.toLowerCase()}: Invalid email or password!`,
      );
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setError("");
    } catch (error) {
      console.error(
        `Error trying to ${authType.toLowerCase()} with Google:`,
        error,
      );
      setError(`Failed to ${authType.toLowerCase()} with Google!`);
    }
  };

  return (
    <Card className="w-100">
      <CardHeader>
        <CardTitle>{authType}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleEmailAuth} className="w-full">
          {authType}
        </Button>
        <Separator />
        <Button onClick={handleGoogleAuth} className="w-full">
          {authType} with Google
        </Button>
      </CardContent>
    </Card>
  );
}

export default function SignInTabs() {
  return (
    <Tabs defaultValue="Sign In" className="w-100">
      <TabsList className="w-full">
        <TabsTrigger value="Sign In">Sign In</TabsTrigger>
        <TabsTrigger value="Sign Up">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="Sign In">
        <SignInCard authType="Sign In" />
      </TabsContent>
      <TabsContent value="Sign Up">
        <SignInCard authType="Sign Up" />
      </TabsContent>
    </Tabs>
  );
}
