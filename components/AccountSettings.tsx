"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User as UserIcon } from "lucide-react";
import FileUpload from "./file-upload";
import Loading from "./Loading";

type Props = {};

const AccountSettings = (props: Props) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [changedEmail, setChangedEmail] = useState<string | undefined>(
    undefined
  );
  const supabase = createClient();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const initUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      setUser(user);
      setChangedEmail(user?.email ?? "");
      setAvatarUrl(user?.user_metadata.picture);
      setName(user?.user_metadata.name);
    };
    initUser();
  }, []);

  const handleResetPassword = () => {
    router.push("/password-reset");
  };

  const handleSaveAccount = async () => {
    setIsSaving(true);
    const { data, error } = await supabase.auth.updateUser({
      data: { picture: avatarUrl, name: name, full_name: name },
    });
    console.log("DATA");
    console.log(data);
    console.log("Error");
    console.log(error);

    if (error) {
      console.log(error);
      return null;
    }
    setIsSaving(false);
    return data;
  };

  const handleInvitation = async () => {
    const email = prompt("Send invitation to email:");
    if (!email) {
      console.error("No valid Email");
      return;
    }
    // const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);
    // console.log("DATA");
    // console.log(data);
    // console.log("ERROR");
    // console.log(error);
  };

  const handleChangeEmail = async () => {
    router.push("/email-reset");
  };

  return (
    <>
      <h2 className="font-bold text-4xl mb-4 text-white">Account</h2>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <CardDescription>Get in touch with us.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FileUpload
              apiEndpoint="avatar"
              value={avatarUrl}
              onChange={(url) => {
                console.log("AVATAR CHANGED");
                console.log(url);
                setAvatarUrl(url ? url : "");
              }}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">Name</Label>
                <Input
                  id="first-name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => {
                    console.log("NAME:", e.target.value);
                    setName(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                type="email"
                value={changedEmail}
                onChange={(e) => setChangedEmail(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col flex-1 gap-4">
            <Button className="bg-blue-800" onClick={handleChangeEmail}>
              Change Email
            </Button>
            <Button onClick={handleResetPassword} className="bg-blue-800">
              Reset Password Email
            </Button>
            <div className="flex flex-row gap-12 justify-end pt-12">
              <Button onClick={handleInvitation} className="w-1/2 bg-blue-800">
                {isSaving && <Loading />}
                Invite User
              </Button>
              <Button
                onClick={handleSaveAccount}
                className="w-1/2 bg-green-800"
              >
                {isSaving && <Loading />}
                Save Account Details
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default AccountSettings;
