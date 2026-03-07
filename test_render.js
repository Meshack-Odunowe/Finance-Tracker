const { jwtVerify, SignJWT } = require("jose");
const crypto = require("crypto");

async function run() {
  const secret = new TextEncoder().encode(
    "your-super-secret-jwt-key-change-this-in-production"
  );
  
  const token = await new SignJWT({ userId: "mock-user-id" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
    
  const res = await fetch("http://localhost:3000/dashboard", {
    headers: {
      cookie: `auth-token=${token}`
    }
  });
  
  const html = await res.text();
  console.log("Status:", res.status);
  console.log("Contains DashboardHeader:", html.includes("flex h-16 items-center justify-between border-b"));
  console.log("Contains Capital mobile title:", html.includes("flex items-center md:hidden"));
}
run();
