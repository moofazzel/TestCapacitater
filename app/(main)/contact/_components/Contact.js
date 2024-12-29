"use client";

import { RocknRoll_One } from "next/font/google";
import Image from "next/image";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import logo from "../../../../public/assets/contact.png";

const rocknroll = RocknRoll_One({ subsets: ["latin"], weight: "400" });

const Contact = () => {
  const methods = useForm();
  const { register, handleSubmit, reset } = methods;
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const FORMSPARK_ACTION_URL = "https://submit-form.com/tD31hS7on";

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await fetch(FORMSPARK_ACTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        reset();
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 7000);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-full xl:max-w-[1400px] 2xl:max-w-[1536px]  flex flex-col mt-28 overflow-hidden px-0">
      <div className="hidden max-w-2xl mx-auto text-center md:block">
        <div
          className={`mb-3 text-[56px] font-bold text-gray-800 letter-spacing reduced-line-height ${rocknroll.className}`}
        >
          Get in touch with us <br />
          Send a<span className="text-color5 text-stroke"> Quick Message</span>
        </div>
        <style jsx>{`
          .text-stroke {
            color: white;
            -webkit-text-stroke: 5px #04bc04;
            text-shadow: 0px 0px 2px #04bc04;
          }
          .letter-spacing {
            letter-spacing: -5px;
          }
          .reduced-line-height {
            line-height: 1.2;
          }
        `}</style>

        <p className="text-lg text-center text-color02">
          We look forward to hearing from you!
        </p>
      </div>
      <div className="max-w-2xl px-5 mx-auto text-center md:hidden">
        <div
          className={`mb-3 text-[56px] font-bold text-gray-800 letter-spacing reduced-line-height ${rocknroll.className}`}
        >
          Get in touch with us
          <br />
          Send a <br />
          <span className="text-color5 text-stroke"> Quick Message</span>
        </div>
        <style jsx>{`
          .text-stroke {
            color: white;
            -webkit-text-stroke: 5px #04bc04;
            text-shadow: 0px 0px 2px #04bc04;
          }
          .letter-spacing {
            letter-spacing: -5px;
          }
          .reduced-line-height {
            line-height: 1.2;
          }
        `}</style>

        <p className="text-lg text-center text-color02">
          We look forward to hearing from you!
        </p>
      </div>

      <div className="flex flex-col mt-12 overflow-hidden shadow-dark-gray md:flex-row mb-36">
        <div className="p-10 md:p-32 md:w-1/2 bg-color10">
          <Image src={logo} alt="Contact Us" layout="responsive" />
        </div>

        <div className="p-7 md:p-24 bg-color3 md:w-1/2">
          <div className="mb-8 text-center text-white">
            <p className="mb-4 text-2xl font-bold">Message Details Here</p>
            <p className="text-lg">We will be in touch soon!</p>
          </div>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <div className="space-y-2 text-lg font-medium">
                  <label className="text-white">Name</label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    type="text"
                    placeholder="Name"
                    className="w-full px-5 py-2 placeholder-color02"
                  />
                </div>
              </div>

              <div className="mb-4 space-y-4 md:flex md:space-y-0 md:space-x-4">
                <div className="space-y-2 text-lg font-medium">
                  <label className="text-white">Phone</label>
                  <input
                    {...register("phone", { required: "Phone is required" })}
                    type="text"
                    placeholder="Phone"
                    className="w-full px-5 py-2 placeholder-color02"
                  />
                </div>
                <div className="space-y-2 text-lg font-medium">
                  <label className="text-white">Email</label>
                  <input
                    {...register("email", { required: "Email is required" })}
                    type="email"
                    placeholder="Email"
                    className="w-full px-5 py-2 placeholder-color02"
                  />
                </div>
              </div>

              <div className="mb-4 space-y-2 text-lg font-medium">
                <label className="text-white">Your Message</label>
                <textarea
                  {...register("message", { required: "Message is required" })}
                  rows={4}
                  placeholder="Your Message..."
                  className="w-full px-3 py-2 border placeholder-color02"
                />
              </div>

              <div className="flex justify-center">
                {loading ? (
                  <button
                    type="button"
                    className="px-6 py-3 bg-gray-500 rounded-md"
                    disabled
                  >
                    Loading...
                  </button>
                ) : isSubmitted ? (
                  <div className="font-semibold text-center text-white">
                    Your message has been sent successfully!
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-4 text-lg font-semibold bg-white text-color3"
                  >
                    Send Message
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default Contact;
