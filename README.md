# Testimonials Collection Platform  

A powerful SAAS platform for businesses and daily miscellaneous projects to collect, manage, and showcase testimonials with various features like authentication, customizable testimonial forms, embeddable galleries, and subscription-based plans.  

## 🚀 Features  

### 🔑 Authentication  
- **NextAuth.js** for secure sign-in/sign-up. 
- Sign in with **Google, GitHub, or credentials**.  
- **OTP-based authentication** using Resend for email verification.  
- Unique usernames are generated in **real-time** for users signing up via Google/GitHub using **`unique-names-generator`**.  
- For OTP sign-ups, users **choose their own username**, which is validated for uniqueness at **real-time**.
- **Passwords are stored securely** with bcryptjs encryption.  

### 💰 Subscription Plans (Paddle Integration)  
- **Free, Pro, and Lifetime** subscription plans.  
- Managed using **Paddle** for payments.  

### 📂 Spaces & Testimonials Management  
- Users can **create spaces** for different projects.  
- **Unique space link** for each space where customers can submit testimonials.  
- Businesses can **toggle acceptance of new testimonials** on/off.  
- **Custom testimonial form** with Project Title, Project URL, Project Logo, Custom Prompt Text, Placeholder Text using **React Hook Form**

### 📝 Testimonials Page  
- View all collected testimonials.  
- **Search** desired testimonials 
- **Pagination** for easier navigation.  
- **Like testimonials** to save them in the "Love Gallery".  
- **Delete testimonials** when needed.  

### ❤️ Love Gallery & Embedding  
- Collection of **favorite testimonials** in a dedicated gallery.  
- **Preview feature** to see how testimonials appear before embedding in your own website.  
- **Embed testimonials on external websites** using different themes and layout like light/dark, grid/carousel. 

### 🖼️ Avatar & Profile Management  
- Customers can upload a **custom avatar** when submitting testimonials.  
- If no avatar is uploaded, a random one is generated using packages like-  
  - **`animal-avatar-generator`**  
  - **`jdenticon`**  
- Testimonial **project logos** and **users-avatars** are saved in **Cloudinary**.  

### ⚡ Real-Time & Performance Enhancements  
- Debounced **username availability check** every **3 seconds** using `useDebouncedCallback`.  
- **Optimized API calls** for fast and seamless experience.  

## 🛠️ Tech Stack  

-**Language:** Typescript
- **Frontend:** Next.js, Tailwind CSS, ShadCN  
- **Backend:** Next.js API routes, MongoDB, Mongoose  
- **Authentication:** NextAuth.js (Google, GitHub, Credentials)  
- **Email & OTP:** Resend  
- **Payments:** Paddle  
- **File Uploads:** Cloudinary  
- **State Management & Hooks:** SWR, usehooks-ts
- **Validation:** React Hook Form, Zod  
- **Animations:** Framer Motion  

 
## Configuration and Setup

To run this project locally:

1. Clone the repository or download it as a zip file.
2. Install all the dependencies.
3. Create a `.env` file in the root directory and provide the required configuration details given in .env.sample
4. Run commands given below and the project will start running on 3000 port.

### Commands to Run the Project

Run the following commands in your terminal:

```bash
# Navigate to the root directory
npm install
npm run dev



