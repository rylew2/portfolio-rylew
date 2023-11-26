---
title: The Manager's Path Review
date: '2023-06'
slug: 'managerspath'
selectedWork: true
description: 'A review of the canonical engineering management book '
previewImage: '/images/project/managersPath/managerspath.png'
tags:
    - management
---

# Introduction

Software engineering management is a multifaceted role involving both team leadership and technical decision-making. `The Manager's Path` is the canonical book in this field, guiding readers from the basics of management to the intricacies of executive leadership roles such as VP or CTO.

> "What engineering managers do, though, is not pure people management. We are managing groups of technical people, and most of us come into the role from a position of hands-on expertise. I wouldn't recommend trying to do it any other way!"

# Chapter 1: Management 101

> "Friends of mine talk about their best managers as managing them with "benign neglect".

Everyone's first management experience is actually being managed. For those interested in management, it's crucial to seek out a competent manager to report to; if that's not possible, observing various management styles is a beneficial alternative.

#### 1-on-1s

One of the most important aspects of management is establishing a regular cadence of 1-on-1s. These should establish a safe and trusting environment that allows for human connection while also creating a platform to discuss the direct report's career aspirations and goals. Managers should listen actively and empathetically, while direct reports should take responsibility for their career direction and/or come prepared to discuss what they'd like to talk about.

-   An important step in setting up 1on1's is what's called ["contracting"](https://www.theengineeringmanager.com/management-101/contracting/). This involves asking the report questions about expectations:
    -   "What are the areas that you would like support with?"
    -   "How would you like to receive feedback and support from me?" (frequency, timing of bad news)
    -   "How confidential is the content of our meetings"
-   Typically these are not status meetings, although I've found they can be, if the report encounters a lot of blockers. Status can be updated in other avenues (slack, email)
-   Offer both praise and constructive criticism - focusing on specific examples and actionable suggestions
    -   Typically praise can be public, while criticism should be reserved for private communications. I've found that you can typically ask direct reports how they like to receive feedback. Some people like an async message before the 1-on-1, others prefer to just hear all feedback in person.
    -   A good manager lets reports know when they screw up - the sooner a report knows about bad habits, the easier it will be to correct. Feedback should be timely (as close to the observed action/behavior as possible), be given in the form of specific examples, and depersonalized (focused on specific actions/decisions/outcomes rather than attacking any person)

> "Regular 1-1s are like oil changes; if you skip them, plan to get stranded on the side of the highway at the worst possible time."

# Chapter 2: Mentoring

Mentoring offers a valuable opportunity for aspiring managers to safely experience the responsibilities and nuances of management, such as being responsible for another person.

Several of the same principles as a manager/direct report relationship carry over to mentorship:

-   a good mentor should actively listen and communicate clearly. It's helpful if communication is done in the style of the mentee (listen and speak their language)
-   a good mentee comes prepared with what they're interested in learning
-   New hiring/onboarding is a great time to setup a mentor/mentee relationship

The result of a successful mentorship might include the mentor going to their network and telling folks how great the company they're working for is.

# Chapter 3: Tech Lead

> "A tech lead is not a point in the career ladder, but rather a set of responsibilities than an engineer may take once they reach the senior level. This role may or may not include people management, but if it does, the tech lead is expected to manage these team members to high management standards..."

The role may not be the most senior on the team, but it is more heavily involved in  **project management** and requires effective delegation skills without resorting to micromanagement. A tech lead shifts from worrying about their own productivity, to focusing more on the whole team's **productivity**

A significant part of the tech lead role involves balancing technical commitments with the broader needs of the team (project management, helping unblock teammates, and in general things that a software engineer up until this point doesn't have as much experience with and may feel less comfortable working on). If as an IC, the SWE was spending almost 100% time spent coding, when they transition to tech lead they might expect to code around 30% of the time.

There are a few different roles as a tech lead:

-   <u>System architect / business analyst </u> - have a good understanding of the overall architecture and understanding of how to design complex software
-   <u>Project planner</u> - break down work into rough deliverables - getting as much productive work ready in parallel as possible. There's a certain dogged persistence that a project planner must carry in order to "push through the unknown" and discover what the work requires, until there's no more value to be gained from spending discovery time. A project planner might also track the project and course correct, use insights gained in the planning process to manage requirement changes, and run a pre and postmortem
-   <u>Software developer/Team leader</u> - this is the part of the role that still writes code. You'll delegate a lot of work as a tech lead, but you should still write and stay up to date with the code

A few tips to be a good tech lead:

-   Understand the architecture - impossible to lead projects when you don't understand the architecture you're changing
-   Be a team player - a tech lead should stop themselves if they're doing all the interesting work. Working on the boring/frustrating parts of the code base can teach you a lot about where the process is broken.
-   Lead technical decisions - have a good sense of decisions that you must make versus what you should delegate to others with more expertise
-   Communicate - Instead of every team member sitting in technical meetings, you're representing them as tech lead - bring info from those meetings back to the team.

# Chapter 4: Managing People

> "It's hard to accept that a "new manager" is an entry-level job with no seniority to any front, but that's the best mindset with which to start leading.

When you're managing people, your team is only as healthy as the individuals. There are several important people management tasks like holding regular 1-on-1s, giving feedback on career growth and progression toward goals, and identifying areas for improvement. To effectively initiate a management relationship, the following specific actions are recommended:

-   Make time to understand the person reporting to you on a personal level
-   Create a 30/60/90 day plan for development
-   Try to encourage the report's participation in new hire documentation - a fresh set of eyes can see things from a different perspective than whoever created this type of team documentation
-   Contracting (as described in 1on1s above) - set expectations and communication style

### Delegation

A common tendency for new managers is to want to maintain control over projects and micromanage - the hardest thing about this is realizing when some projects do actually need more oversight (IE.. junior engineers who thrive under close direction). However, if you strip away too much autonomy and creative freedom from some of your direct reports via micromanagement, you could end up demotivating them, leading to a disillusionment that might be similar to burnout. There's nothing worse than feeling like every decision has to constantly be double checked by your manager. The ideal way this book advocates to approach these situations as a manager is to think about how you delegate work. Delegation is not giving up all responsibility to reports, but rather helping them understand responsibilities and being there to support them and the project.

To delegate effectively you need to:

-   Use team goals and system stability as a gauge for determining what to focus on. If systems are stable there's little need to stay intimately involved with all details. However a team with no clear plan might need more oversight
-   Gather info from systems before meeting with project team-members. Since the team may be having difficulty already, and will be less productive if they're constantly seeking information for you, it's better to first try to pull as much data as you can
-   Adjust your focus depending on the stage of the project - a project in its earlier stages may be more concerned with system design, while project progress will be more important for a project that's closer to its deadline
-   Establishing a set of team standards is tremendously beneficial to allow everyone to communicate well and depersonalize the feedback process - IE... how much unit testing, at what point does a technical decision need to involve the larger group (like adding a new system or language)
-   Allow for the open sharing of info, regardless of whether the content is good or bad. If someone is failing on a project, it's critical that they're allowed to communicate this fact early. A culture of blame will only make it more likely that people will hide this kind of info

### Continuous Feedback and Reviews

Continuous feedback is a commitment to regularly share both positive and corrective feedback. For 1 on 1 manager-report relationships, the frequency and timing of this feedback is often guided by answers to the contracting questions. To be effective at giving feedback, managers need a knack for observing and understanding their team. What are the goals, strengths, and weaknesses of your reports and team members? Good managers have an intuition for identifying talents and helping people draw more out of their strengths. As an exercise, each week, you could try to identify at least one item to praise about someone on your team. Feedback should be lightweight and regular. There's also a tendency when everything is going well to just give praise, but in these scenarios you should also strive to make suggestions about what could be even better in the future.

While continuous feedback provides an opportunity for more frequent feedback, performance reviews are a more formal wholistic approach. Typically feedback comes from the manager, teammates, a self review, and anyone who reports to the individual. The manager of this person will then gather all these reviews to write the manager's review. Some tips for giving performance reviews:

-   **Stay specific and use examples** - this will help you write more unbiased reviews
    -   Similarly, keep areas for improvement specific - share feedback you think is valuable and can be acted on. If there is little negative feedback, it could mean the person is ready for more challenging projects or possibly promotion
-   If regular feedback has been given, in alignment with the continuous feedback philosophy outlined above, there should be** no big surprises in performance reviews**
-   Give yourself enough time to write a thoughtful and considerate review. Also give yourself enough time to talk through the review with your report(s)
-   **Try to avoid any recency biases** by accounting for the whole year rather than just the past couple of months

If a report is a candidate for improvement, as a manager you'll need to make the case for their improvement. You'll need to fully understand how the promotion process works at your company - and be able to be transparent with your team in explaining how this works. Part of the role of a manager is, before the promotion nominations are made, to identify promotion-worthy projects that high achieving team members can take on.

#### Handling Underperformance

One of the basic rules of management is the rule of no surprises, particularly negative ones. If regular negative feedback doesn't result in improvement, you'll likely need to create a performance improvement plan (PIP) - which will include a set of clearly defined objectives that a person must achieve within a fixed period of time. You typically want a record of all negative feedback you've given prior to (and during) the PIP in case the employee isn't able to improve according to their plan and you need toe escalate to a firing, which will usually be handled by HR. You typically don't want to put anyone on a plan whom you wouldn't be happy to lose.

Another difficult situation arises when you believe that your team is not the right place for your report to grow their career. In this instance, some managers will "coach their report out" or encourage them to grow their career in another part of the organization. You're not technically firing them, but you are giving them time and space to find something more suited for them.

# Chapter 5: Managing a Team

The report manager relationship is largely similar when you're managing one or multiple people, however when you start managing a team there is a totally different set of requirements and challenges. The book describes a team manager as an `engineering lead` - in this role there is less time spent writing code but team managers still engage in small technical deliverables (bug fixes, small features) without blocking/slowing the progress of their team. It's not just writing code anymore though, it's identifying bottlenecks and removing blockers for their teams success. A good team manager isn't about having technical knowledge, although that helps, the work of supporting people is far more important to management success.

The team manager will often help identify the most high-value projects and keep their team focused on these projects - this involves partnering closely with the product lead to ensure deliverables are met. Part of the management role also includes identifying headcount and other recruiting needs. This role also includes managing the technical roadmap for their product group, communicating timeline, scope and risks to their product/group pillar partners, identifying tech debt, doing cost benefit analysis for resolving debt, and helping communicate timelines for prioritizing this to the management team.

### Staying Technical

Engineering management is people skills plus technical discipline. Your technical instinct should have been honed over years of doing the job. If you want to command the respect of the engineering team, they must see you as technically credible (otherwise you're facing an uphill battle). If you don't stay in the code, you risk becoming technically obsolete too early in your career (staying in the code helps you see where the bottlenecks and process problems are). A good manager can identify the shortest path through systems to implement new features.

### Debugging Dysfunction

Sometimes teams continually miss deliverables, people are unhappy, product managers are frustrated, and your attrition rate rises. If you're not entirely sure what the issue is, there are a few steps you can take to debug the root causes:

-   **Not shipping** - As a manager you'll need to push for the removal of bottlenecks (IE... hold the team accountable for more frequent releases). When people are contending for scarce resources, conflicts and unhappiness among team members are common and inevitable. As a manager you can spend more time coding in this scenario.
-   **People drama** - Make it clear bad behavior has to change. Providing clear examples and corrective feedback quickly after events happen may be the best defense against such conflict. Quick action is essential.
-   **Burnout** - Identifying a root cause of overworked employees can help here. For example, if an unstable prod system causes engineers to be constantly fighting fires, your job as manager is to slow down the product roadmap to focus more on stability (and technical debt (20% rule)). Try to use metrics around downtime and incidents to help inform action plans to reduce them. For time-critical releases, as a manager, you'll need to play cheerleader here and help out with the work at times. Be appreciative (continuous feedback) of your team during periods you know have been difficult, offering breaks, while making the process as enjoyable (or even fun) as it can be.
-   **Collaboration problems** - If your team isn't working well cross-functionally (with design, product, or another tech team), you'll want to meet with management and other peers to understand and work through issues. If the teams aren't working well together, look into creating some opportunities for them to hang out (short game time maybe?).

### Driving Good Decisions

The engineering manager is usually accountable for the team's progress. There are a few tips outlined for how to drive decisions, since as a manager you may only have authority to guide decisions rather than dictate them, however you'll still be judged on the ultimate outcome.

-   **data-driven team culture** - create a habit of giving the product/business data about the team velocity, quality measures (outages, bugs found, etc...). Even the 4 DORA metrics could be useful here (deployment frequency, lead time to changes, mean time to recovery, change failure rate)
-   **Flex your product muscles** - It's important to develop customer empathy to give your engineers context for your work
-   **Thinking ahead** - Thinking about where the product roadmap is going can help you guide the technical roadmap. Ask the product team questions about the future, and spend some time keeping up with technology developments that might impact the way you think about software or how you're operating
-   **Review the outcome of decisions and projects** - review assumptions made after the project is done (done at the scrum team level with retros)
-   **Run retros for the processes and day to day** - discuss what happened during the sprint and pick a few events (good, bad, and neutral to discuss in detail)

### Conflict Management

Have a team that's constantly in disagreement can be painful and dysfunctional - however on the other end of the spectrum is artificial harmony where everyone just agrees for the sake of agreeing, even though they're unhappy with decisions being made. The key is to create a safe environment for disagreement to work itself out, which is far better than pretending that all disagreement does not exist.

-   **Don't rely on consensus voting** - well established teams can predict the direction fo a decision, so it's best not to set people up for a vote you know will go certain way. It's better to deliver bad news yourself
-   **Setup processes to depersonalize** - start with a shared understanding of goals, risks, and questions that go into making a decision.
-   **Don't turn a blind eye to simmering issues** - If you don't pay close enough attention, issues will go on for way too long to a point where they're difficult to address
-   **Don't take it out on other teams**
-   **Be kind** - You do'nt need to be overly "nice" ("please" and "thank you"). Being kind is telling someone who isn't ready for promotion that she isn't ready
-   **Don't be afraid of conflict** - It's natural to be worried about making people upset with a decision - this is OK. It's however a wise habit to be sensitive to the outcomes of a conflict
-   **Be curious about your own actions** - "Am I pushing decisions to the team because I don't want to deal with it as an engineering manager?" "Am I avoiding working through the issues with my peer because their difficult to work with?"

### Engineering Manager Project Management

As an engineering manager, you're responsible for the larger picture planning. While tech leads/devs are planning in terms of weeks, as manager, you should be planning higher level in terms of months. Some rough guidelines include:

-   Budgeting 20% of your time for sustaining engineer work (testing, debugging, tech debt, migrating versions etc...).
-   Budget roughly 10 productive engineering weeks per quarter (with PTO/holidays)
-   Understand your "must-haves" versus "nice-to-haves" and be willing to say no to things
-   Use the doubling rule for estimates - when asked for estimates, double what you would guess it would take

# Chapter 6: Managing Multiple Teams

Advancing in the management track, particularly to the role of a Director of Engineering, often leads to managing multiple teams - at this point you'll likely have multiple tech leads reporting to you.

### Proper time management

> When you have so many management duties that you have little time to code, you can start to feel like your day has been taken hostage by the whims of others

You'll need to carefully consider how you manage your time at this level of management. This often comes down to understanding the importance and urgency of the matter. Tasks that are both important and urgent are ones you'll definitely need to prioritize, but there may be several distractions each day that seem urgent, but are in fact not.

<table class="managerspath">
    <tr>
        <th><strong></strong></th>
        <th><strong>Not Urgent</strong></th>
        <th><strong>Urgent</strong></th>
    </tr>
    <tr>
        <td><strong>Important</strong></td>
        <td>Strategic, make time</td>
        <td>Obvious Work</td>
    </tr>
    <tr>
        <td><strong>Unimportant</strong></td>
        <td>Obvious avoid</td>
        <td>Tempting distractions</td>
    </tr>
</table>

> As you navigate your new obligations, start to ask yourself: How important is the thing I’m doing? Does it seem to be important because it’s urgent?

#### Delegation to reduce plate-spinning

A related topic to time management is the process of delegation. The book uses "plate-spinning" as an analogy of management, where you have a bunch of plates on different poles, and you must attend to each spinning plate before it slows down and falls off. You have to develop good instinct to anticipate when certain plates stop spinning (teams get burnt out, or processes need improvement). The only way to not feel overwhelmed by all the plate-spinning is to effectively delegate tasks:

<table class="managerspath">
    <tr>
        <th><strong></strong></th>
        <th><strong>Frequent </strong></th>
        <th><strong>Infrequent</strong></th>
    </tr>
    <tr>
        <td><strong>Simple</strong></td>
        <td><strong>Delegate</strong> <br /> (running daily standups, writing a weekly summary of progress, conducting code reviews)</td>
        <td><strong>Do it yourself</strong> <br />(booking occasional conference tickets, running the quarterly script)</td>
    </tr>
    <tr>
        <td><strong>Complex</strong></td>
        <td><strong>Delegate carefully</strong> <br /> (grow talent in areas like project planning, system design, or outage/incident management)</td>
        <td><strong>Delegate for training purposes</strong> <br /> (have a tech lead sit with you to write performance reviews, project staffing planning)</td>
    </tr>
</table>

> Delegation is a process that starts slow but turns into an essential element for career growth. If your teams can’t operate well without you, you’ll find it hard to be promoted.

#### Saying No

Being able to say no is also a useful strategy with respect to time management and finding the most impactful work to do:

-   **Yes we can do this project if we delay the start of the other**
-   **Appeal to budget** - lay out current workload in plain terms, showing how little room there is to maneuver
-   **Don't drag out a no answer** - Sometimes it's better to say no more quickly than to drag out such a response - if you're wrong you'll need to apologize for the mistake
-   **Help me say yes** - If you dig into (and question) the parts of someone else's plan that seem questionable, you'll help the other person realize that their suggestion isn't a good idea or needs refinement

### Creating a durable shared team identity

Creating a shared team identity is difficult and it is easy to focus too internally on the team, leading the team to feel superior to others in the organization. If the team goes too far in this direction it can become resistant to outside ideas, be a poor at adapting to organization changes, and be too focused on empire building. Whereas a team that is more committed to the company's mission fosters resilience that leads to an openness to innovation, prioritizing company-wide objectives over team goals, and adaptability.

Creating durable teams requires aligning with the company's core values and mission. In less well defined environments like startups, these missions can be fuzzy and you'll need to think about setting up teams to work well within a larger picture and mission.

# Chapter 7: Managing Managers

Managing managers shares many similarities with managing multiple teams, including several of the same responsibilities of overseeing the health of your direct reports' teams. There is however an increased scope when you're managing managers - instead of managing a couple closely related teams, you're now managing possibly whole functions like engineering and operations (areas you may not be as familiar with) - and your'e responsible for the health of those teams. It becomes easy to miss details when you're no longer meeting with just ICs.

Some tips to maintain healthy teams with this increased scope:

-   **Open door policy fallacy** - It's easy to think you can have an open door policy for ICs to escalate issues to you. However most engineers won't be brave enough to take the risk of talking about problems. Instead you'll need to evaluate the health of your direct reports' teams - ideally via 1on1s with your direct report managers (these will need to be real conversations that should identify any attrition, failure to ship or other issues that reflect back to you as the higher-level manager)
-   **Skip-level meetings** - help get perspective on the health and focus of your teams and develop personal relationships between you and everyone in the organization. Can be as frequent as once a quarter.
    -   Some prompts might include : What do you like best or worst about your project? Who has been doing well? Feedback about their manager? How do you see the whole organization doing? What's keeping you from doing your best work?

#### Manager Accountability

The primary role of a manger who oversees other managers is to ensure these direct reports are effectively leading their team and aligning within the organization's broader goals.

It's common for managers to excel at managing up and to hide problems until they become unwieldy. While this may make your life as a manager's manager easier in the short term, it's better to hold them to account as soon as you get a hint of any issue. Part of this is having your manager's keep track of the health of their teams. Your role might also involve navigating complex situations where your direct reports are managing issues with tech leads or product managers - where the lines of responsibility are less clear.

There are several possibly tricky issues that managers of teams should be held to account for:

-   **Unsable product roadmaps** - Managers of teams should address rapidly changing roadmap (which can lead to attrition)
-   **Errant tech leads** - Managers need to guide tech leads to ensure design processes are efficient/transparent - possibly involving other senior team members
-   **Constant firefighting** - Managers should develop plans to tackle underlying issues that cause frequent crises - and possibly consider requesting additional resources

As a higher level manager you are responsible for supporting and developing these managers. You should provide support in cases where your direct report may not have as much influence, or in hiring decisions. You should also provide ample feedback that focuses on both strengths and weaknesses that you can identify. If you're able to improve the performance of your direct report managers, this can significantly impact the organization's success, and by extension your own reputation and effectiveness as the overseeing manager.

#### People pleaser management flaws

People pleaser managers can develop a deep aversion to making people they care about unhappy and will often say yes, possibly leading to their own burnout. The team may like this type of manager on a personal level, but be frustrated with them as a manager. This manager never pushes back on work, overpromises and underdelivers, and says yes to everyone which can send contradictory messages. The manager is more interested in a team that runs smoothly and avoids mistakes than a team that really becomes excellent. Worse yet, if the manager has fears of failure or rejection, it can make it harder for the team to fail in a healthy way. Promises can be made that are hard to keep and make the team bitter toward the manager or company. If you have a direct report manager displaying these characteristics, you'll want to highlight the downsides to exhibiting this behavior.

Some tips to coach this type of manager include:

-   help them feel safe saying no
-   have them externalize decisions so more people take part in the decisioning process (if it fails it's a team failure)
-   provide the person strong partners who can take on the task of determining the work roadmap
-   focus on better processes - allowing the manager to point to these processes as something outside their control

#### Managing New vs Experienced Managers

First-time managers need a lot of coaching, but it's an up-front cost that pays long-term dividends. Some common coaching you might need to do is ensure this manager is effective at delegating work, ensure they're not taking the job for just the authority, make sure you're doing skip levels to understand the health of the team, and as mentioned earlier, holding the manager accountable so issues aren't spiraling out of control. You want to nominate the right person for the role of a manager - if it turns out a new manager doesn't belong in that role you generally don't want to keep them in that position.

Bringing in experienced managers is slightly different - since management is such a culture-specific task in a company, you'll want to ensure they fit with the wider company culture. It's not just skills you're hiring for, you'll want to bring in a software engineering manager who has worked with teams, knows how to ship software frequently, is comfortable with modern dev practices, and can inspire creativity with engineers. The hiring process for these managers could include mock problem solving with actual employees who might be the new hire's direct reports. While there could be coding in interviews for managers, you're also looking for strong team debugging skills, and ensure they have had a successful management philosophy (staying in code, breaking problems date, observing with data). Reference checks could also be valuable in the hiring process, where you ask how this person has succeeded and failed working with the reference.

#### Debugging Dysfunctional Teams

The best engineering managers are great debuggers - relentless in the pursuit of why. The book describes managing teams as a series of complex black blockes interacting with other black boxes - when you encounter outputs that aren't as expected you'll need to figure out why by "opening up boxes" to see what's going on.

Possible team debugging steps:

-   Have a hypothesis for how the system got into a failed state
-   **Observe the team** - sit in the team's meetings. Good meetings have a heavy discussion element where opinions are drawn out of the team. A boring meeting may be a sing of an issue
-   **Ask questions** - ask the team what their goals are to see if they have a clearly defined purpose
-   **Check team dynamics** - teams that run smoothly typically have a degree of personal connection between the members. If team members are working independently on different projects, they're not really working as a team
-   **Jump in to help** - its ok to jump in and help debug - particularly when the enw manager in question is struggling

#### Staying Technically Relevant

Without investment into technical skills, managers run the risk of becoming out of touch and obsolete. There are ways to stay relevant such as reading code (reviewing PRs), picking an unknown area and ask engineers to explain, attend postmortem/retros, keep up with industry trends, and maintaining a network of technical people. By staying relevant in technical areas you provide specific values to teams - you help the team stay accountable to where it places its energy, you're able to identify misguided efforts by asking informed questions, you're able to analyze the engineering and business tradeoffs, and you'll be able to make specific requests to teams without distracting

> Managers who don’t stay technical enough sometimes find themselves in the
> bad habit of acting as a go-between for senior management and their teams.
> Instead of filtering requests, they relay them to the team and then relay the
> team’s response back up to management. This is not a value-add role

# Chapter 8: The Big Leagues

> As technical senior managers, we bring special skills to an organization. In particular, we bring a willingness to embrace and drive changes as needed. ... We understand that technology evolves quickly, and we want our organizations to evolve to keep up with these changes. ... It's not enough to be a change agent; we have to create an organization that can successfully follow through on the changes we want to push.

Roles such as CTO, VP, and Head of Engineering extend beyond being a positive technical force; they also encompass leadership, understanding the current and future business landscape, making hard decisions without perfect information, understanding how to play politics in a productive way, and a willingness to still deliver on decisions you disagree with. There are a few categories of tasks that any general manager might take on (from the _High Output Management_ book):

-   **Info Gathering/Sharing** - Sitting in meetings, reading/writing emails/slack messages, talking to people one on one, and gathering perspectives. The goal is to synthesize large quantities of info, teasing out critical pieces
-   **Nudging** - Reminding people of their commitments by asking questions instead of giving orders. It's easier to nudge by asking questions that guide a team rather than more forceful suggestions
-   **Decision making** - One of the difficult aspects of management - managers must take different perspectives and incomplete info, and make a decision where the impact affects you and the team
-   **Role modeling** - Setting the best example for the team

#### VP of Engineering vs CTO

<table style="border-collapse: collapse; width: 100%;">
    <tr>
        <th style="border: 1px solid black; background-color: black; color: white; padding: 8px;">Aspect</th>
        <th style="border: 1px solid black; background-color: black; color: white; padding: 8px;">VP of Engineering</th>
        <th style="border: 1px solid black; background-color: black; color: white; padding: 8px;">CTO</th>
    </tr>
    <tr>
        <td style="border: 1px solid black; padding: 8px;">Position in Management</td>
        <td style="border: 1px solid black; padding: 8px;">Top of the management career for engineering</td>
        <td style="border: 1px solid black; padding: 8px;">Executive first, technologist second</td>
    </tr>
    <tr>
        <td style="border: 1px solid black; padding: 8px;">Focus</td>
        <td style="border: 1px solid black; padding: 8px;">Detail-oriented and able to handle both high-level and low-level tasks</td>
        <td style="border: 1px solid black; padding: 8px;">Larger, strategic overview of technology in the company</td>
    </tr>
    <tr>
        <td style="border: 1px solid black; padding: 8px;">Responsibilities</td>
        <td style="border: 1px solid black; padding: 8px;">Roadmap development, hiring planning, org strategy, people management, improving engineering process, and cross-functional partnering</td>
        <td style="border: 1px solid black; padding: 8px;">Positioning technology in the company, strategic technical decisions, oversee architecture and process/guidelines for evolving it, go deep into understanding biz side, external events and speaking engagements</td>
    </tr>
</table>

### Setting Strategy

Setting strategy is likely an area that most newer big league managers might not be skilled at. The book offers a few tips here:

-   **Research** - understand the current and future scaling issues, current productivity bottlenecks, pain points of the current tech, where growth will come from
-   **Combine research with your ideas** - draw out systems at company and slice/dice across various common attributes. IE. looking at systems that are customer facing (customer service tools) vs systems that are internal operations-facing (warehouses)
-   **Draft a strategy** - actionable ideas to improve operational efficiency and expand features and grow the business
-   **Consider boards communication style** - Presentation style matters. Some boards read deck materials beforehand, in which case you should have a deck that includes valuable info

> ...good technology here meant several things. It meant technology architectures, yes. It also meant team structure. It meant understanding the underpinnings of the business and the directions in which it was headed. ... for product-focus companies ... something that "enables the many potential futures of the business." It's not just a reactive document that tries to account for current problems, but it anticipates and enables future growth.

### Tips for Dealing with Nontechnical Bosses

When you work in engineering for a longer period of time with technical managers, suddenly having a nontechnical boss can be a bit jarring, but there are a few best practices to manage this specific relationship:

-   **Don't hide info behind jargon**
-   **Expect you will need to lead 1on1s** - come prepared with a list of topics
-   **Try to bring solutions, not problems**
-   **It's OK to ask for advice**
-   **Don't be afraid to repeat yourself in communication** - most people remember things after hearing it from others 3 times
-   **Be supportive** - ask if there's more you can do to help
-   **Seek out coaching and skill development elsewhere** - your boss likely won't be able to help you here, so you'll need to seek out other peers or even look outside the company for support

### Detaching as a Senior Leader

As a senior leader your days of socializing with your team outside working hours is a thing of the past. You must learn to detach, otherwise you risk being seen as playing favorites if you maintain strong social ties with team members.

-   **Be a good role model** - As a senior leader, you'll likely be watched more closely than you ever have before - a lot of employees with follow every little behavior or small thing you say. Your presence will change the tone and structure of meetings you attend.
-   **Making hard decisions** - There's times where you won't need to discuss hard decisions with other people. You'll also not want to rant to other teammates about the difficulty of decisions
-   **Care more about people as individuals** - At this level, it can be easy to treat them like cogs, so you'll want to take the time to get to know as many people as you can as humans. This kind of personalization will be noticed.

### Correcting a Culture of Fear

It's easy for fear to propagate amongst the team when managers are quick to criticism, visibly upset, or otherwise easily display negative emotions. This can lead to a loss of psychological safety and willingness to take risks amongst the team. Healthy teams should be independent, willing to take risks, and free to push themselves. There's also typically open debate to resolve conflict amongst engineers as peers, but when you as a senior manager are debating, others may be more fearful to speak up. There are a few tips in this case to correct a culture of fear:

-   **Practice relatedness** - A marker of fear might be the tendency to treat people impersonally. Be willing to engage in small talk and getting to know the team as people.
-   **Apologize when you screw up** - Model that it's ok to make mistakes, it doesn't make you weak
-   **Get curious** - It's much easier to approach a disagreement with curiosity, which can turn disagreement into honest questioning
-   **Hold people accountable without making them out as bad** - When you hold your team accountable for not meeting expectation, make sure you understand how your framing things - asking questions like "How do we measure success in this scenario?", or "Did I set the team up for success

# Chapter 9: Bootstrapping Culture

> Where you are growing a new team or reforming an existing team, neglecting team culture is a sure-fire way to make your job harder. As the team grows and evolves, it's important to attend to your culture as you would attend to other importance pieces of infrastructure that you rely on.

Effective leaders possess the ability to identify and shape underlying system structures and team dynamics, and it's important that they take action in these areas in a way that support long-term goals. The book emphasizes the importance of choosing systems that guide us toward our next milestone and facilitate learning from the successes and failures of these processes and structures, rather than perceiving 'structure and processes' as hindrances to development, a common thought in agile, scrappy startup cultures. It's better to choose an imperfect system early on and learn from it then be paralyzed by such a decision and have the company scale out without any systems or processes.

### Assessing your role

When setting up structure and processes, it's important to understand the size of the ship (your company) that you, as a leader, are steering. This can be determined through some of the following characteristics:

-   **People** - leaders who want a high degree of control over their org tend to need more structure in place to ensure their wishes are enacted
-   **Age** - the longer a company is around, the more habits become entrenched (and the more likely it is to continue to survive)
-   **Size of existing infrasturcutre** - the less business rules, code, and infrastructure there is, the less the need for structure (and vice versa)
-   **Risk tolerance** - Are you in a highly regulated industry? Do you have a lot to lose if certain mistakes are made? Structures and processes should reflect this

### What is Culture

> Culture is how things get down, without people having to think about it.

Culture is the unspoken shared rules of a community. It doesn't mean every person needs to hold the exact same values, but it tends to guide a general overlap. In more complex environments where the needs of the group must override the needs of the individual, cultural values are the glue that enables us to work as a team.

-   To reinforce culture, you can reward people for exhibiting its values in positive ways (IE.. in performance reviews). You can learn to spot people The stories that we tell as a community bond us together.
-   Learn to spot people who have value conflicts with the company/team. Be willing to coach people in areas where they're misaligned
-   You'll want to look for culture fit in interviews, but culture fit is not about hiring friends (this won't lead to the strongest teams)

### Cultural Policy Documents

Drafting cultural policy documents is likely not the more coveted role of managers, but fortunately there are fewer and fewer of these types of docs that need to be started from scratch - many are shared publicly online. You typically want to add structure, such as policy documents, when things are failing.

#### Cultural Policy Document Example - Writing a career ladder

If there's inconsistencies around what HR should pay new hires, or how long it
Some tips for writing a career ladder include:

-   **Look for examples from other companies**
-   **Solicit support from your team** - senior managers and engineers can provide feedback and details
-   **Provide more early opportunities for advancement** - You may want to promote early career employees every year for the first two to three years of their career.
-   **Use narrow salary bands for early-career stages** that allow for quick promotion, use wider bands when you have fewer levels.
    -   You want salary bands to overlap - IE. Jr SWE 50-100k, Sr Swe 80-150k. This allows you to retain talent who are performing well at their current level but not ready to take on the additional responsibility at the next level. This also lets you hire people who are on the fence into the lower level with the expectation of a quick promotion.
-   **Consider breakpoint levels** - The "breakpoint level" is the lowest level at which people can sit forever (never getting promoted but also not underperforming). Expect your team to cluster around this level, with fewer people above or below it
-   **Celebrate and share keystone promotions**
-   **Split management and technical tracks**
-   **Consider making people management skills a mid-career requirement** - similarly, a tech lead might be a requirement of a senior IC on the technical track
-   **Years of experience** - Distinguish levels by an expectation of maturity increase, typically this corresponds with YOE
-   **Don't be afraid to evolve over time** - a ladder should be a living document that evolves as the company grows

### Cross Functional vs Engineering Focused Teams

In a small company or startup, it's clear that the engineering team is working with pretty much everyone, be it product managers, designers, etc.... In a larger company, there's likely already a structure setup to facilitate roles and cross functional collaboration. The book suggests that engineers be directly on a "pod"/team with product managers and designers, as this often leads to effective product development and iteration. Typically in pods, engineers with the best product sense emerge as leaders. Engineering still needs to oversee critical core systems - these functions can be kept in a small infrastructure organization that does not need to be assigned to product development.

It's important for engineering teams, even those assigned with product teams, to still devote 20% of their time for sustaining tasks (interviewing, tech-deb,t on-call).

### Engineering Processes to add as a team grows

There are 3 major processes you should consider formalizing as the team grows - each work best with behavioral expectations around them (in addition to technical details):

-   **Code review** - largely a socialization exercise so multiple team members have seen and are aware of changed code. Typically bugs are caught via the test suite and less likely to be caught in peer code reviews
    -   use a linter to resolve style issues
    -   limit how many outstanding review requests a person can have assigned to them (Github round robin and load balancing)
-   **Outage postmortems**
    -   resist the urge to point fingers
    -   look at circumstances and understand context to help identify root cause
    -   determine which takeaways are important - there should be one or two truly high-risk glaring issues that could cause future problems
-   **Architecture review** - help socialize big changes to the appropriate group, and make the risk for those changes clear.
    -   Architecture questions - How many people on the team are comfortable using the new system? What's the process for rolling it out? Are there new operational considerations?
    -   be specific about the kinds of changes that need architecture review (new languages/frameworks, storage systems, new dev tooling)
    -   process of preparing for architecture review is important - forces people to carefully consider why they want to make these changes
    -   choose the review board wisely - should be those most closely impacted by decision

# Conclusion

Reflecting on the extensive insights provided in 'The Manager's Path,' the transition from mentor to executive emerges as both a challenging and rewarding journey. One of the takeaways of the book is the importance of being self-aware for effective leadership. As a manager, you'll need to understand your own reactions, inspirations, and frustrations in order to manage others well. You'll also need to cultivate curiosity (the author suggests daily free-writing here as a way to remind yourself to stay curious) - curiosity helps understand various perspectives, particularly in challenging interpersonal situations.

## Resources

-   [The Manager's Path Summary - Runn.io Blog](https://www.runn.io/blog/the-managers-path-summary)
-   [Learning Notes on The Manager's Path - GitHub](https://github.com/keyvanakbary/learning-notes/blob/master/books/the-managers-path.md)
-   [The Manager's Path Book Summary - Dan Lebrero's Blog](https://danlebrero.com/2020/07/22/the-managers-path-book-summary/)
-   [The Engineering Manager](https://www.theengineeringmanager.com/)
