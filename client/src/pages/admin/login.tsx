import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Redirect } from "wouter";

import { useAuth } from "@/hooks/use-auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function AdminLogin() {
  const { user, loginMutation } = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate(values);
  }

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/admin/dashboard" />;
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-heading text-primary">
                NATIONAL FURNITURE
              </h1>
              <p className="text-neutral-dark/70 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Admin Dashboard for National Furniture - Established 1972
              </p>
            </div>
            <div className="space-y-2 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15v2a2 2 0 002 2h10a2 2 0 002-2v-2" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Manage Your Store
              </h2>
              <p className="text-neutral-dark/70 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                Add/edit products, create special offers, and manage your website content through this admin panel.
              </p>
            </div>
          </div>
          
          <div className="mx-auto flex flex-col justify-center space-y-6 lg:max-w-none">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-2xl">Admin Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access the dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="admin" 
                              disabled={loginMutation.isPending} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              disabled={loginMutation.isPending} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        'Login'
                      )}
                    </Button>
                    
                    {loginMutation.isError && (
                      <div className="p-3 rounded-md bg-destructive/10 border border-destructive text-sm text-destructive">
                        {loginMutation.error.message || 'Invalid username or password'}
                      </div>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
