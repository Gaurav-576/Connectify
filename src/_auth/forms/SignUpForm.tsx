// import React from 'react'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SignUpValidation } from "@/lib/validation"
import { Loader } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
// import { createUserAccount } from "@/lib/appwrite/api"
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccountMutation, useSignInAccount } from "@/lib/react-query/queryAndMutations"
import { useUserContext } from "@/context/AuthContext"

const SignUpForm = () => {
  const { toast } = useToast()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()
  const { mutateAsync: createUserAccount, isPending: isCreatingUser} = useCreateUserAccountMutation()
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })
  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    const newUser = await createUserAccount(values)
    console.log("we are here");
    const session = await signInAccount({
      email: values.email,
      password: values.password
    })
    if(!session) {
      return toast({
        title: "Sign Up failed. Please try again!"
      })
    }
    const isLoggedIn = await checkAuthUser();
    if(isLoggedIn) {
      form.reset()
      navigate('/')
    }
    else {
      toast({
        title: "Sign Up failed. Please try again!"
      })
    }
  }
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="./public/assets/images/newLogo.png" alt="logo"/>
        <h2 className="h3-bold md:h2-bold text-2xl font-bold mt-4">Sign Up</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">Create a new Connectify Account</p>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                {/* <FormDescription>
                  This name will be shown publically to other users.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
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
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {(isUserLoading || isCreatingUser || isSigningIn) ? 
            <div className="flex-center gap-2">
              <Loader /> Loading...
            </div>
            : "Sign Up"}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account? <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Sign In</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignUpForm