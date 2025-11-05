// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-cv",
          title: "cv",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "WIP",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-software",
          title: "software",
          description: "Edit the `_data/repositories.yml` and change the `github_users` and `github_repos` lists to include your own GitHub profile and repositories.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/software/";
          },
        },{id: "post-inside-lines-equipment-porteur-rackbag-review",
        
          title: "Inside Lines Equipment Porteur Rackbag Review",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2018/ile-rackbag/";
          
        },
      },{id: "post-a-deep-dive-into-the-stellar-public-network-part-1",
        
          title: "A deep dive into the Stellar public network (Part 1)",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2018/stellar-network-analysis/";
          
        },
      },{id: "post-keeping-a-reading-list",
        
          title: "Keeping a reading list",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2018/reading-list/";
          
        },
      },{id: "post-ucsf-should-match-employee-donations-to-sfbike",
        
          title: "UCSF should match employee donations to SFBike",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2017/ucsf-sfbike-match/";
          
        },
      },{id: "post-active-matter-modeling",
        
          title: "Active matter modeling",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2017/microtubule-vortices/";
          
        },
      },{id: "post-copper-creek-and-lower-paradise-valley-trip-report",
        
          title: "Copper Creek and Lower Paradise Valley Trip Report",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2017/kings-canyon-trip-report/";
          
        },
      },{id: "post-ucsf-graduate-student-taxes-faq",
        
          title: "UCSF Graduate Student Taxes FAQ",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2017/grad-student-taxes/";
          
        },
      },{id: "post-embedding-videos-in-google-slides-as-gifs",
        
          title: "Embedding videos in Google Slides as GIFs",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2016/videos-in-google-slides-gifs/";
          
        },
      },{id: "post-precision-recall-curves-in-julia",
        
          title: "Precision-Recall curves in Julia",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2016/precision-recall-julia/";
          
        },
      },{id: "post-native-mtp-interconnect-on-mac-linux",
        
          title: "Native MTP interconnect on Mac/Linux",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2016/mtp-interconnect-mac-linux/";
          
        },
      },{id: "post-building-this-jekyll-site-on-debian-8",
        
          title: "Building this Jekyll site on Debian 8",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2016/building-jekyll-site-debian/";
          
        },
      },{id: "post-new-year-new-site",
        
          title: "New year, new site",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2016/revamp/";
          
        },
      },{id: "post-predicting-drug-candidate-promiscuity",
        
          title: "Predicting Drug Candidate Promiscuity",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2014/predicting-drug-candidate-promiscuity/";
          
        },
      },{id: "post-life-sans-facebook",
        
          title: "Life, Sans Facebook",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2014/life-sans-facebook/";
          
        },
      },{id: "post-scholarly-markdown-for-scientific-writing",
        
          title: "Scholarly Markdown for Scientific Writing",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2014/scientific-writing-pandoc/";
          
        },
      },{id: "post-open",
        
          title: "Open",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2013/open/";
          
        },
      },{id: "news-finally-updated-my-website-sweat-smile-it-s-now-using-the-al-folio-theme-sparkles",
          title: 'Finally updated my website :sweat_smile:, it’s now using the al-folio theme! :sparkles:',
          description: "",
          section: "News",},{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
