# QBee Online

Course-selling site and student portal for **QBeeMind Solutions Pvt. Ltd.**: 18 project-based certificate courses in VLSI, Embedded Systems and Edge AI, plus tracks, bundles, course + board packages, internships and a student portal with in-browser labs.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build to dist/
npm run preview   # serve dist/
```

Copy `.env.example` to `.env.local` and add Firebase keys to turn on real email/Google login. If you don't add keys, the app runs in **preview mode**, where any email logs in with a sample learner's data so the client can click through the portal.

## Structure

```
src/
  data/catalog.ts      ← ALL course, track, kit, programme, policy content (from the 2026 catalogues)
  data/labs.ts         ← in-browser lab definitions (starter code + checks)
  lib/pricing.ts       ← bundle pricing rules (sliding scale, tracks, domain/two-domain/all-access)
  lib/store.tsx        ← cart, auth, portal state (localStorage, fails safe)
  lib/assistant.ts     ← chatbot answers, generated from catalog.ts only
  components/          ← Header (mega menu), Footer, RolePicker hero, CourseCard, TrackRow, Chatbot, FAQ, ui primitives
  pages/               ← Home, Courses, CourseDetail, Programs, Kits, Internships, Placements, Institutions, About, Contact, Policies, Cart, Login
  pages/portal/        ← Dashboard, MyCourse (player), Labs (editor + runner), Assignments, KitTracking, Booking, Certificates
```

To change a price, course, or policy, edit `src/data/catalog.ts`. Every page and the chatbot read from it.

## Pricing rules (lib/pricing.ts)

- Single course ₹15,000
- An exact match to a named track uses the track price (₹27,000 for 2 courses, ₹38,000 for 3)
- Otherwise build-your-own: 2 courses 10% off, 3 courses 15% off, 4–5 courses 20% off
- All 6 courses in a domain ₹65,000; two complete domains ₹1,15,000; all 18 courses are the All-Access Career Program at ₹1,65,000
- Courses already included in a board package aren't charged twice

## Before launch: what still needs connecting

| Area | Where | What to do |
|---|---|---|
| Payments | `pages/Cart.tsx` `pay()` | Create a Razorpay order on the server, open Checkout, verify the signature, then enrol |
| Leads | `pages/Contact.tsx` `submit()` | POST to CRM / email |
| Portal data | `lib/store.tsx` | Replace localStorage with an API (enrolments, submissions, kit orders, bookings) |
| Assignment uploads | `pages/portal/Assignments.tsx` | Upload to Firebase Storage / S3 |
| Lab runner | `pages/portal/Labs.tsx` `run()` | Send code to a sandboxed runner (iverilog/verilator, arm-gcc + QEMU, Python) |
| Lab booking inventory | `pages/portal/Booking.tsx` `RESOURCES` | Real equipment list + availability API |
| Chatbot | `lib/assistant.ts` | Optionally put an LLM behind your backend, using catalog.ts as context; keep this file as the fallback |
| Contact details | `data/catalog.ts` `CONTACT` | Real email, phone, WhatsApp, address (shown highlighted as placeholders) |
| Routing | `App.tsx` | Switch `HashRouter` to `BrowserRouter` once the host rewrites all paths to `index.html` |

## Content questions for the client

1. VLSI catalogue: "any 3 courses 15% off" = ₹38,250, but the 3-course tracks are ₹38,000. The site uses ₹38,000 for exact track matches and ₹38,250 for other sets of 3. Confirm.
2. Brand name on the site: "QBee Online" (by QBeeMind Solutions)?
3. Contact details, batch start dates, refund cut-off days.
4. Remote lab equipment and slot timings.
