"use client";

/**
 * Admin User Questionnaire Page
 *
 * Displays user's questionnaire responses in a structured format.
 */

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminLayout, Button } from "@/components/shared";
import { UserQuestionnaireView } from "@/components/admin/questionnaire";
import { getUserById, type AdminUserDetail } from "@/services/admin";
import { siteContent } from "@/content/he";

const content = siteContent.admin;

interface PageParams {
  userId: string;
}

function BackButton() {
  return (
    <Link
      href="/admin/users"
      className="inline-flex items-center gap-2 text-[#706F6F] hover:text-[#1D1D1B] transition-colors"
    >
      <svg
        className="w-5 h-5 rotate-180"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span>{content.userDetail.backToList}</span>
    </Link>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#215388]" />
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {message}
    </div>
  );
}

function NoQuestionnaire() {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm text-center">
      <svg
        className="w-16 h-16 mx-auto text-[#C6C6C6] mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 className="text-lg font-semibold text-[#1D1D1B] mb-2">
        {content.userDetail.noQuestionnaires}
      </h3>
      <p className="text-[#706F6F]">המשתמש טרם מילא שאלון רילוקיישן.</p>
    </div>
  );
}

function QuestionnairePageContent({ userId }: { userId: string }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      setIsLoading(true);
      setError("");

      const { user: userData, error: fetchError } = await getUserById(userId);

      if (fetchError || !userData) {
        setError(fetchError || "שגיאה בטעינת פרטי המשתמש");
        setIsLoading(false);
        return;
      }

      setUser(userData);
      setIsLoading(false);
    }

    loadUser();
  }, [userId]);

  // Get the most recent questionnaire
  const questionnaire = user?.questionnaires?.[0];

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <BackButton />
        <h1 className="text-2xl font-bold text-[#1D1D1B] mt-4">
          צפייה בשאלון
        </h1>
        {user && (
          <p className="text-[#706F6F] mt-1">
            {user.firstName} {user.lastName}
          </p>
        )}
      </div>

      {/* Error */}
      {error && <ErrorMessage message={error} />}

      {/* Loading */}
      {isLoading && <LoadingSpinner />}

      {/* Content */}
      {!isLoading && !error && (
        <>
          {questionnaire ? (
            <UserQuestionnaireView
              questionnaire={questionnaire}
              user={{
                id: user!.id,
                email: user!.email,
                firstName: user!.firstName,
                lastName: user!.lastName,
              }}
            />
          ) : (
            <NoQuestionnaire />
          )}
        </>
      )}

      {/* Actions */}
      {!isLoading && !error && questionnaire && (
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/users")}
          >
            {content.userDetail.backToList}
          </Button>
        </div>
      )}
    </main>
  );
}

export default function AdminUserQuestionnairePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const resolvedParams = use(params);

  return (
    <AdminLayout activeTab="users">
      <QuestionnairePageContent userId={resolvedParams.userId} />
    </AdminLayout>
  );
}
