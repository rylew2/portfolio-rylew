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

## Introduction

Software engineering management is a multifaceted role that involves both leading a team while also steering technical decisions. "The Manager's Path" is the canonical book  in this field, guiding readers from the basics of management to the intricacies of executive leadership roles such as VP or CTO.

> "What engineering managers do, though, is not pure people management. We are managing groups of technical people, and most of us come into the role from a position of hands-on expertise. I wouldn't recommend trying to do it any other way!"

### Management 101

> "Friends of mine talk about their best managers as managing them with "benign neglect".

Everyone's first management experience is actually being managed. I think if someone is interested in becoming a manager, it's important to seek out good managers - if this is not possible, at least observe different styles of management.

#### 1-on-1s
One of the most important aspects of management is establishing a regular cadence of 1-on-1s. These should establish a safe and trusting environment that allows for human connection while also creating a platform to discuss the direct report's career aspirations and goals. Managers should listen actively and empathetically, while direct reports should take responsibility for their career direction and/or come prepared to discuss what they'd like to talk about.

- An important step in setting up 1on1's is what's called ["contracting"](https://www.theengineeringmanager.com/management-101/contracting/). This involves asking the report questions about expectations:
    - "What are the areas that you would like support with?"
    - "How would you like to receive feedback and support from me?" (frequency, timing of bad news)
    - "How confidential is the content of our meetings"
- Typically these are not status meetings, although I've found they can be, if the report encounters a lot of blockers. Status can be updated in other avenues (slack, email)
- Offer both praise and constructive criticism - focusing on specific examples and actionable suggestions
    - Typically praise can be public, while criticism should be reserved for private communications. I've found that you can typically ask direct reports how they like to receive feedback. Some people like an async message before the 1-on-1, others prefer to just hear all feedback in person.
  - A good manager lets reports know when they screw up - the sooner a report knows about bad habits, the easier it will be to correct. Feedback should be timely (as close to the observed action/behavior as possible), be given in the form of specific examples, and depersonalized (focused on specific actions/decisions/outcomes rather than attacking any person)


> "Regular 1-1s are like oil changes; if you skip them, plan to get stranded on the side of the highway at the worst possible time."


### Mentoring

Mentoring is a great opportunity for anyone interested in management because it provides a safe way to get the feel for the job of management, and the feeling of being responsible for another person.

Several of the same principles as a manager/direct report relationship carry over to mentorship:
- a good mentor should actively listen and communicate clearly. It's helpful if communication is done in the style of the mentee (listen and speak their language)
- a good mentee comes prepared with what they're interested in learning
- New hiring/onboarding is a great time to setup a mentor/mentee relationship


The result of a successful mentorship might include the mentor going to their network and telling folks how great the company they're working for is.


## Chapter 2: Tech Lead

>"A tech lead is not a point in the career ladder, but rather a set of responsibilities than an engineer may take once they reach the senior level. This role may or may not include people management, but if it does, the tech lead is expected to manage these team members to high management standards..."

 The role may also not be the most senior on the team; it just happens to more heavily involved in **project management** and being able to delegate work effectively without micromanaging. A tech lead shifts from worrying about their own productivity, to focusing more on the whole team's **productivity**

Much of the tech lead role is about learning to balance technical commitments with work the whole team needs (project management, helping unblock teammates, and in general things that a software engineer up until this point doesn't have as much experience with and may feel less comfortable working on). If as an IC, the SWE was spending almost 100% time spent coding, when they transition to tech lead they might expect to code around 30% of the time.

There are a few different roles as a tech lead:

- <u>System architect / business analyst </u> - have a good understanding of the overall architecture and understanding of how to design complex software
- <u>Project planner</u> - break down work into rough deliverables - getting as much productive work ready in parallel as possible. There's a certain dogged persistence that a project planner must carry in order to "push through the unknown" and discover what the work requires, until there's no more value to be gained from spending discovery time. A project planner might also track the project and course correct, use insights gained in the planning process to manage requirement changes, and run a pre and postmortem
- <u>Software developer/Team leader</u> - this is the part of the role that still writes code. You'll delegate a lot of work as a tech lead, but you should still write and stay up to date with the code


A few tips to be a good tech lead:

- Understand the architecture - impossible to lead projects when you don't understand the architecture you're changing
- Be a team player - a tech lead should stop themselves if they're doing all the interesting work. Working on the boring/frustrating parts of the code base can teach you a lot about where the process is broken.
- Lead technical decisions - have a good sense of decisions that you must make versus what you should delegate to others with more expertise
- Communicate - Instead of every team member sitting in technical meetings, you're representing them as tech lead - bring info from those meetings back to the team.


## Chapter 3: Managing People

> "It's hard to accept that "new manager" is an entry-level job with no seniority to any front, but that's the best mindset with which to start leading.

When you're managing people, your team is only as healthy as the individuals. There are several important people management tasks like holding regular 1-on-1s, giving feedback on career growth and progression toward goals, and identifying areas for improvement. However there are specific actions that can make a management relationship start off:

- Leave room to get to know the person reporting to you as a human being
- Create a 30/60/90 day plan for development
- Try to encourage the report's participation in new hire documentation - a fresh set of eyes can see things from a different perspective than whoever created this type of team documentation
- Contracting (as described in 1on1s above) - set expectations and communication style

### Delegation

A common tendency for new managers is to want to maintain control over projects and micromanage - the hardest thing about this is realizing when some projects do actually need more oversight (IE.. junior engineers who thrive under close direction). However, if you strip away too much autonomy and creative freedom from some of your direct reports via micromanagement, you could end up demotivating them, leading to a disillusionment that might be similar to burnout. There's nothing worse than feeling like every decision has to constantly be double checked by your manager. The ideal way this book advocates to approach these situations as a manager is to think about how you delegate work. Delegation is not giving up all responsibility to reports, but rather helping them understand responsibilities and being there to support them and the project.

To delegate effectively you need to:

- Use team goals and system stability as a gauge for determining what to focus on. If systems are stable there's little need to stay intimately involved with all details. However a team with no clear plan might need more oversight
- Gather info from systems before meeting with project team-members. Since the team may be having difficulty already, and will be less productive if they're constantly seeking information for you, it's better to first try to pull as much data as you can
- Adjust your focus depending on the stage of the project - a project in its earlier stages may be more concerned with system design, while project progress will be more important for a project that's closer to its deadline
- Establishing a set of team standards is tremendously beneficial to allow everyone to communicate well and depersonalize the feedback process  - IE... how much unit testing, at what point does a technical decision need to involve the larger group (like adding a new system or language)
- Allow for the open sharing of info, regardless of whether the content is good or bad. If someone is failing on a project, it's critical that they're allowed to communicate this fact early. A culture of blame will only make it more likely that people will hide this kind of info

### Continuous Feedback and Reviews

Continuous feedback is a commitment to regularly share both positive and corrective feedback. For 1 on 1 manager-report relationships, the frequency and timing of this feedback is often guided by answers to the contracting questions. To be effective at giving feedback, managers need a knack for observing and understanding their team. What are the goals, strengths, and weaknesses of your reports and team members? Good managers have an intuition for identifying talents and helping people draw more out of their strengths. As an exercise, each week, you could try to identify at least one item to praise about someone on your team. Feedback should be lightweight and regular. There's also a tendency when everything is going well to just give praise, but in these scenarios you should also strive to make suggestions about what could be even better in the future.

While continuous feedback provides an opportunity for more frequent feedback, performance reviews are a more formal wholistic approach. Typically feedback comes from the manager, teammates, a self review, and anyone who reports to the individual. The manager of this person will then gather all these reviews to write the manager's review. Some tips for giving performance reviews:
- Stay specific and use examples - this will help you write more unbiased reviews
    - Similarly, keep areas for improvement specific - share feedback you think is valuable and can be acted on. If there is little negative feedback, it could mean the person is ready for more challenging projects or possibly promotion
- If regular feedback has been given, in alignment with the continuous feedback philosophy outlined above, there should be no big surprises in performance reviews
- Give yourself enough time to write a thoughtful and considerate review. Also give yourself enough time to talk through the review with your report(s)
- Try to avoid any recency biases by accounting for the whole year rather than just the past couple of months

If a report is a candidate for improvement, as a manager you'll need to make the case for their improvement. You'll need to fully understand how the promotion process works at your company - and be able to be transparent with your team in explaining how this works. Part of the role of a manager is, before the promotion nominations are made, to identify promotion-worthy projects that high achieving team members can take on.

#### Handling Underperformance

One of the basic rules of management is the rule of no surprises, particularly negative ones. If regular negative feedback doesn't result in improvement, you'll likely need to create a performance improvement plan (PIP) - which will include a set of clearly defined objectives that a person must achieve within a fixed period of time. You typically want a record of all negative feedback you've given prior to (and during) the PIP in case the employee isn't able to improve according to their plan and you need toe escalate to a firing, which will usually be handled by HR. You typically don't want to put anyone on a plan whom you wouldn't be happy to lose.

Another difficult situation arises when you believe that your team is not the right place for your report to grow their career. In this instance, some managers will "coach their report out" or encourage them to grow their career in another part of the organization. You're not technically firing them, but you are giving them time and space to find something more suited for them.


## Managing a Team

The report manager relationship is largely similar when you're managing one or multiple people, however when you start managing a team there is a totally different set of requirements and challenges. The book gives a description of a team manager as an `engineering lead` - in this role there is less time spent writing code but team managers still engage in small technical deliverables (bug fixes, small features) without blocking/slowing the progress of their team. It's not just writing code anymore though, it's identifying bottlenecks and removing blockers for their teams success. A good team manager isn't about having technical knowledge, although that helps, the work of supporting people is far more important to management success.

The team manager will often help identify the most high-value projects and keep their team focused on these projects - this involves partnering closely with the product lead to ensure deliverables are met. Part of the management role also includes identifying headcount and other recruiting needs. This role also includes managing the technical roadmap for their product group, communicating timeline, scope and risks to their product/group pillar partners, identifying tech debt, doing cost benefit analysis for resolving debt, and helping communicate timelines for prioritizing this to the management team.

### Staying Technical

Engineering management is people skills plus technical discipline. Your technical instinct should have been honed over years of doing the job. If you want to command the respect of the engineering team, they must see you as technically credible (otherwise you're facing an uphill battle). If you don't stay in the code, you risk becoming technically obsolete too early in your career (staying in the code helps you see where the bottlenecks and process problems are). A good manager can identify the shortest path through systems to implement new features.


### Debugging Dysfunction

Sometimes teams continually miss deliverables, people are unhappy, product managers are frustrated, and your attrition rate rises. If you're not entirely sure what the issue is, there are a few steps you can take to debug the root causes:

- **Not shipping** - As a manager you'll need to push for the removal of bottlenecks (IE... hold the team accountable for more frequent releases). When people are contending for scarce resources, conflicts and unhappiness among team members are common and inevitable. As a manager you can spend more time coding in this scenario.
- **People drama** - Make it clear bad behavior has to change. Providing clear examples and corrective feedback quickly after events happen may be the best defense against such conflict. Quick action is essential.
- **Burnout** - Identifying a root cause of overworked employees can help here. For example, if an unstable prod system causes engineers to be constantly fighting fires, your job as manager is to slow down the product roadmap to focus more on stability (and technical debt (20% rule)). Try to use metrics around downtime and incidents to help inform action plans to reduce them. For time-critical releases, as a manager, you'll need to play cheerleader here and help out with the work at times. Be appreciative (continuous feedback) of your team during periods you know have been difficult, offering breaks, while making the process as enjoyable (or even fun) as it can be.
- **Collaboration problems** - If your team isn't working well cross-functionally (with design, product, or another tech team), you'll want to meet with management and other peers to understand and work through issues. If the teams aren't working well together, look into creating some opportunities for them to hang out (short game time maybe?).


### Driving Good Decisions

The engineering manager is usually accountable for the team's progress. There are a few tips outlined for how to drive decisions, since as a manager you may only have authority to guide decisions rather than dictate them, however you'll still be judged on the ultimate outcome.

- **data-driven team culture** - create a habit of giving the product/business data about the team velocity, quality measures (outages, bugs found, etc...). Even the 4 DORA metrics could be useful here (deployment frequency, lead time to changes, mean time to recovery, change failure rate)
- **flex your product muscles** - It's important to develop customer empathy to give your engineers context for your work
- **Thinking ahead** - Thinking about where the product roadmap is going can help you guide the technical roadmap. Ask the product team questions about the future, and spend some time keeping up with technology developments that might impact the way you think about software or how you're operating
- **Review the outcome of decisions and projects** - review assumptions made after the project is done (done at the scrum team level with retros)
- **Run retros for the processes and day to day** - discuss what happened during the sprint and pick a few events (good, bad, and neutral to discuss in detail)







### Chapter 5: Managing Multiple Teams

Summary: Expands on the challenges of scaling management skills to oversee multiple teams, including cross-team communications and maintaining a cohesive culture.

### Chapter 6: Managing Managers

Summary: Covers the transition to managing managers, highlighting the shift from direct to indirect influence and how to empower leaders within your organization.

### Chapter 7: The Big Leagues

Summary: Offers insight into senior leadership roles, such as VP of Engineering and CTO, and the strategic thinking required to guide a company's technical vision.

### Chapter 8: Bootstrapping Culture

Summary: Examines the role of leadership in shaping and nurturing company culture, particularly in the early stages or during significant growth.

## Conclusion

Reflecting on the breadth of knowledge within "The Manager's Path," it's clear that the journey from mentor to executive is both challenging and rewarding. This book serves as a comprehensive guide for any engineer looking to navigate the complexities of management in tech.

## Resources

- [The Manager's Path Summary - Runn.io Blog](https://www.runn.io/blog/the-managers-path-summary)
- [Learning Notes on The Manager's Path - GitHub](https://github.com/keyvanakbary/learning-notes/blob/master/books/the-managers-path.md)
- [The Manager's Path Book Summary - Dan Lebrero's Blog](https://danlebrero.com/2020/07/22/the-managers-path-book-summary/)
- [The Engineering Manager](https://www.theengineeringmanager.com/)
