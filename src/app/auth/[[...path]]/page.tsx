"use client";
import Auth from "../_components/Auth";

export default function LoginPage() {
  return (
    <>
      <div className="flex-col-center min-h-[80vh] pb-16 pt-8">
        <section className="w-full">
          <div className="flex items-center justify-center">
            <Auth />
          </div>
        </section>
      </div>
    </>
  );
}
