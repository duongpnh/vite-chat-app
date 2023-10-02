import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios'
import { useMutation } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

type InputSignIn = {
  username: string
  password: string
}

export const SignIn = () => {
  const {
    register,
    handleSubmit,
  } = useForm<InputSignIn>()
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const state = location.state as { from: Location };
  const from = state ? state.from.pathname : '/chat';

  const signInMutation = useMutation({
    mutationFn: (data: InputSignIn) => axios.post('http://localhost:3000/api/auth/sign-in', data).then(res => {
      console.log("🚀 ~ file: SignIn.tsx:25 ~ mutationFn: ~ res:", res)
      return res;
    }),
    onSuccess: (res: any, vars: any, context: any) => {
      console.log("🚀 ~ file: SignIn.tsx:26 ~ SignIn ~ vars:", vars)
      console.log("🚀 ~ file: SignIn.tsx:26 ~ SignIn ~ context:", context)
      if (res.data?.success) {
        const { username, token } = res.data;
        auth.signIn(JSON.stringify({ username, token }), () => {
          navigate(from, { replace: true });
        })
      }
    },
    onError: (error) => {
      console.log("🚀 ~ file: SignIn.tsx:23 ~ SignIn ~ error:", error.response.data);
    }
  })
  
  const onSubmit: SubmitHandler<InputSignIn> = async (data: InputSignIn) => {
    console.log("🚀 ~ file: SignIn.tsx:15 ~ constonSubmit:SubmitHandler<InputSignIn>= ~ data:", JSON.stringify(data))
    signInMutation.mutate(data);
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
              <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
              Chat App    
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Sign in to your account
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6" action="#">
                    <div>
                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input type="text" {...register('username', { required: true })} id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="username" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input type="password" {...register('password')} id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="flex items-center justify-between">
                        {/* <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                            </div>
                        </div> */}
                        <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                    </div>
                    <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Don’t have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                    </p>
                </form>
            </div>
          </div>
      </div>
    </section>
  )
}