---
title: SenseCourse
date: '2018-10'
slug: 'sensecourse'
selectedWork: true
description: 'A look at using Watson AI to select courses based on your personality'
previewImage: '/images/project/sensecourse/demo.jpg'
liveSite: 'https://sensecourse.onrender.com/demo'
sourceCode: 'https://github.com/rylew2/SenseCourse'
presentation: 'https://www.youtube.com/watch?v=LqpXGfcWBt0'
tags:
  - flask
  - python
  - javascript
  - omscs
  - edtech
---

## Intro

SenseCourse is an application that a student teammate and I built for the [Education Technology](https://omscs.gatech.edu/cs-6460-educational-technology) class in my master's program (OMSCS). The Education Technology course offered a comprehensive examination of the intersection between education and technology, focusing on pedagogical models, current issues in EdTech, and insights from research papers and past projects. The application was built using Flask and jQuery and hosted on Heroku.

#### Choosing SenseCourse

While going through several EdTech research papers, I was intrigued by the topic of sentiment analysis and opinion mining and how it could help provide insights into the learning process. A few papers illustrated how well machine learning techniques worked to offer feedback to professors (or students) based on writing samples. The research papers noted how professors could use this automated feedback to adjust their teaching style to match student learning styles.

This ultimately led to us developing SenseCourse—an application that helped students choose a particular set of OMSCS classes (specialization). Fortunately, the OMSCS program had collected hundreds of reviews for each course from former students. As a credit to the program, many of the reviews were positive, but they also had a lot of unrealized feedback potential that we noticed.

![Expressive sentiment from a review of one of the Machine Learning courses. Not all reviews were this positive.](/images/project/sensecourse/reviews.png)

The idea was to generate a collective sentiment analysis for each course based on these reviews and match them with the sentiment analysis generated by user-submitted writing samples. The SenseCourse app asks users several open-ended questions about themselves in the hopes that users respond with enough text so that IBM Watson can provide meaningful insights about their personality.

![High-level view of SenseCourse flow](/images/project/sensecourse/sensecourse-diagram.jpg)

## IBM Watson

IBM Watson is a natural language processing service for text analytics. A subset of the service includes Personality Insights, including what they now call Entity Emotion Scores. While the API has changed since we developed our app, key classification scores are still output today for emotions like joy, anger, fear, and sadness. You can view a short demo of the [text analysis tool here](https://www.ibm.com/demos/live/natural-language-understanding/self-service/home). In the SenseCourse live demo, the application is not hooked up to the now-modified API, but it does have a demo of what the output result looked like when it was working and turned in for the end of the course.

![Personality Insight results from the Watson API](/images/project/sensecourse/personality-insights.jpg)

## Future Research

Considering the one-month project timeline and our subsequent coursework, a full controlled study was beyond this EdTech course's scope. This study might have had one group of students who took the courses recommended by SenseCourse and another who chose classes on their own. By comparing these two control groups and how successful the students were in each class, we might understand how effective the sentiment analysis and course matching schemes were.

Another possible avenue of research in this area would be to see what kind of feedback we could provide to professors from the course reviews. Given the sheer volume of reviews available, perhaps there was some hidden meaning and feedback available in all the reviews for a particular course. If any of that feedback could allow a professor to modify their teaching style, I believe that would be an interesting experiment. Given that this project was only meant to be completed in about a month and we both had to move on to other classes, a full controlled study was beyond the scope of this EdTech course.

## Conclusion

I believe this project has the potential for further refinement by larger EdTech companies with big data resources, such as Coursera, Udemy, or Udacity. As mentioned, there are also several possible research studies that could be realized. For us, it was an interesting foray into the world of text and sentiment analysis and ultimately helped me choose my final two courses.
