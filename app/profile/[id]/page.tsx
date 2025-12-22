export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const value = await params;

  // const user = await getUserById(userId);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">
        User Profile Page - ID: {value.id}
      </h1>
    </div>
  );
}
