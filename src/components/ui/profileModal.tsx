"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Trash2,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormModal } from "@/components/ui/FormModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/useToast";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
} from "@/redux/services/profileApi";
import { useAppDispatch } from "@/redux/hooks";
import { updateUser, logout } from "@/redux/features/auth/authSlice";
import { cn } from "@/lib/utils";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: File | null;
  currentPhoto?: string;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    profilePhoto: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: profileData, isLoading: isLoadingProfile } = useGetProfileQuery(
    undefined,
    {
      skip: !isOpen,
    }
  );

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [deleteProfile, { isLoading: isDeleting }] = useDeleteProfileMutation();

  const initializeForm = useCallback(
    (userData: any) => {
      if (userData && !isInitialized) {
        console.log("Initializing form with user data");
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          profilePhoto: null,
          currentPhoto: userData.profilePhoto || "",
        });
        setPreviewUrl(userData.profilePhoto || "");
        setIsInitialized(true);
      }
    },
    [isInitialized]
  );

  useEffect(() => {
    if (isOpen && profileData?.data) {
      initializeForm(profileData.data);
    }

    if (!isOpen) {
      setIsInitialized(false);
      setIsEditing(false);
    }
  }, [isOpen, profileData, initializeForm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profilePhoto: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      if (formData.firstName)
        formDataToSend.append("firstName", formData.firstName);
      if (formData.lastName)
        formDataToSend.append("lastName", formData.lastName);
      if (formData.email) formDataToSend.append("email", formData.email);
      if (formData.profilePhoto)
        formDataToSend.append("profilePhoto", formData.profilePhoto);

      const response = await updateProfile(formDataToSend).unwrap();

      if (response.success) {
        dispatch(updateUser(response.data));

        if (typeof window !== "undefined") {
          const authData = localStorage.getItem("auth");
          if (authData) {
            const current = JSON.parse(authData);
            localStorage.setItem(
              "auth",
              JSON.stringify({
                ...current,
                user: response.data,
              })
            );
          }
        }

        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
          type: "success",
        });

        initializeForm(response.data);
        setIsEditing(false);
      }
    } catch (error: any) {
      toast({
        title: "Update failed",
        description:
          error?.data?.message || "Failed to update profile. Please try again.",
        type: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteProfile().unwrap();

      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully.",
        type: "success",
      });

      dispatch(logout());
      onClose();
    } catch (error: any) {
      toast({
        title: "Deletion failed",
        description:
          error?.data?.message || "Failed to delete account. Please try again.",
        type: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (profileData?.data) {
      initializeForm(profileData.data);
    }
    setIsEditing(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Edit clicked, setting isEditing to true");
    setIsEditing(true);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="My Profile"
      size="lg"
      className="overflow-hidden">
      <div className="p-6">
        {isLoadingProfile && !isInitialized ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="relative h-32 w-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  {previewUrl ? (
                    <AvatarImage
                      src={previewUrl}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : formData.currentPhoto ? (
                    <AvatarImage
                      src={formData.currentPhoto}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <AvatarFallback className="h-full w-full bg-green-100 flex items-center justify-center">
                      <User className="h-12 w-12 text-green-800" />
                    </AvatarFallback>
                  )}
                </div>

                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors shadow-lg">
                    <Camera className="h-5 w-5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              {isEditing && (
                <p className="text-sm text-gray-500 text-center">
                  Click the camera icon to update your profile photo
                </p>
              )}
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData?.data?.phone || ""}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </p>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Account Status
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">
                      Email Verification
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        profileData?.data?.isEmailVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      )}>
                      {profileData?.data?.isEmailVerified
                        ? "Verified"
                        : "Pending"}
                    </span>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">
                      Phone Verification
                    </span>
                    <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              {isEditing ? (
                <>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 bg-green-600 hover:bg-green-700">
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="flex-1">
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={handleEditClick}
                    className="flex-1 bg-green-600 hover:bg-green-700">
                    Edit Profile
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>

            {/* Stats Section */}
            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Stats
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {profileData?.data?.favorites?.length || 0}
                  </div>
                  <div className="text-sm text-gray-500">Favorites</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {profileData?.data?.deliveryAddresses?.length || 0}
                  </div>
                  <div className="text-sm text-gray-500">Addresses</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {profileData?.data?.isAddressAdded ? "Yes" : "No"}
                  </div>
                  <div className="text-sm text-gray-500">Address Added</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-xs font-medium text-green-800">
                    {profileData?.data?.uniqueId}
                  </div>
                  <div className="text-sm text-gray-500">User ID</div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </FormModal>
  );
}
