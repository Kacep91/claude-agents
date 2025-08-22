A Brief Guide to Setting Up Claude Code from Scratch and How to Use It Effectively for Acceptable Results (80-90% Success Rate)

1. First, you need to configure CLAUDE.md from scratch (using the /init command in the project root). This file is attached to every request and, according to developers, is designed to reduce misunderstanding and enrich queries with project context. In reality - Claude Code very often IGNORES this file or forgets it very quickly as the context grows and eventually starts acting strange (time to create a new chat).

I created a template that you place in the project folder and write in Claude Code "Make changes to @CLAUDE.md so it matches my project. Follow the template principles KISS, Occam's razor, DRY, YAGNI" (see attached file)

I created a template for PROJECT_STRUCTURE.md (speeds up project understanding and reduces time for "searching" files and functions)
Prompt for it:
"Analyze my project structure and create PROJECT_STRUCTURE.md file based on the
PROJECT_STRUCTURE_TEMPLATE.md template. Replace all placeholders in square brackets [PLACEHOLDER] with actual
project data:

1. **Study file structure** - use ls, tree commands to analyze folders
2. **Analyze configurations** - study package.json, tsconfig.json, webpack.config.js and other
   configuration files
3. **Determine architecture** - identify main modules, components, entry points
4. **Find dependencies** - main and dev libraries from package.json
5. **Study commands** - scripts from package.json
6. **Identify features** - unique architecture characteristics of the project

**Replace all placeholders:**

- [PROJECT_NAME] → real project name
- [ARCHITECTURE_TYPE] → architecture type (SPA, MPA, etc)
- [MAIN_STACK] → main technology stack
- [SOURCE_FOLDER] → source code folder
- [ENTRY_POINT] → application entry point
- And all other [PLACEHOLDER] values

**Result should be:**
✅ Accurate - reflect real structure
✅ Complete - cover all key components
✅ Current - match current state
✅ Navigational - help navigate the project

Follow KISS, DRY, YAGNI principles - remove non-applicable sections, add only necessary." (see attached file)

2. You need to configure agents. Place them in the /agents folder where you have Claude installed (find this yourself, for me it's ~./claude which corresponds to the User folder on macOS) (see link https://github.com/Kacep91/claude-agents)

That's it, you're amazing and ready to create.

We have three types of tasks for which we use AI:

1. Simple tasks (processing large amounts of similar files, creating applications from scratch, creating websites from scratch, minor edits (text changes, replacing components with others (when migrating to a new UI library, for example), documentation fixes, etc.))
2. Medium tasks (creating new features from scratch, bug fixes that you already know how to fix/know approximately where to look and just need to implement, bug fixes in features covered by quality tests)
3. Complex tasks (create "bug-free" applications :D, fix bugs so nothing breaks (no test coverage), add large features that affect multiple components and files (i18n implementation from scratch), etc.)

For the first type, we either write a script in our favorite programming language with AI help and it processes huge document arrays. Example: converting a hefty swagger.json into understandable documentation with separation (PRD) and then creating APIs based on this documentation (file weighed 560KB), or we describe in detail the main user-stories and user-cases for the application, for example:

Create a plan for EVERY STAGE that implements each stage of this scenario:

Stage 1:

1. User sends 5 links to hotels they liked. Links can be in any format and to any site, as long as it's clear these are hotels. Or it can just be text - hotel name.
2. We search for these hotels with maximum accuracy on Booking.com and TripAdvisor, using Perplexity API. We input hotel names or user links. Need a good prompt that will allow maximum quality data extraction from user input. If these are booking/tripadvisor links - we search directly by links. For example, we have 2 hotels as input, each with tripAdvisor link. We should find the hotel link on booking.com and proceed to parsing. In Perplexity response we need to get exact name and link to navigate and start parsing
   Stage 2:
3. Check if such hotel already exists in our DB - if yes, make a query there and output everything as in point 10
4. From each found hotel we need to parse first 400 reviews, starting with the freshest (already done, see TripAdvisorParser, BookingParser). Need to add parallel parsing mode for 5 hotels, maintaining anti-detection mode for our bot.
   Stage 3:
5. We form structured JSON with reviews, advantages and disadvantages by key parameters for user for each hotel (extract all available information from the page) (already done, see JSONExporter)
6. Save the obtained JSON with hotel name and all fields filled in the database.
7. We send the formed JSON for processing to GEMINI (or Perplexity — will be decided later) with a prompt to choose the best hotel, individually optimal for the user, considering their preferences (response should be in English text format).
   Stage 4:
8. Get system output
   Add to our DB for this hotel information with AI analysis (additional column)
   Add to our DB the generated xlsx file

In the second case, we use either plan mode in Claude Code (if not too complex in our opinion), or full flow with agents, like:

First of all, use multiple, simultaneous scanner subagents to search, analyze, collect and extract information from code and the internet
Secondly, use project-planner subagent for thorough planning, creating step-by-step plans, with maximum details and phases
Finally, use multiple, simultaneous, parallel worker subagents to execute the plan
ULTRATHINK

@src/components/BullshitComponent/index.tsx
@src/components/BullshitComponents/Bullshitselector.tsx

In my {componentName} component, the BullshitSelector component is not working. It currently works like this:

1. When selecting all parameters and clicking "Add" button in modal window - it adds new value to the form (selected parameter)
2. Then, if I create a new BullshitSelector with "add new entity" button, when adding a new value to the form, this value REPLACES the previous one

Need to make it so that if we have more than one Bullshitselector, each selected parameter is ADDED to the previous one, not REPLACES it

So we described the flow, added links, described the problem, described actual and expected behavior and launch the AI

In this case, it will analyze the code, find all necessary information, launch the planner, make a plan, then launch worker agents to speed up development and start writing code according to the plan

In the third case, we first write what we want as in point two (stages). Then we ask AI to break this into stages (using prd-writer agent), then according to this plan with stages we create a detailed plan for stage 1 following the scheme (scanner => planner => worker => auditor) and so on with each stage. This way, we break large tasks into smaller tasks, carefully plan each one and execute them sequentially (similar to spec-driven approach from Kiro)

There won't be an example here, since the flow is described in general (We describe in maximum detail what we want ourselves, then ask prd-agent to study what we wrote and create prd.md file and then unleash our scanner-planner-worker-auditor flow on the prd.md file with a request to plan the first/second/third stages)
