document.addEventListener("DOMContentLoaded", () => {
  const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Body } = Matter;

  const container = document.getElementById("skills-physics-container");
  const mainContent = document.querySelector(".container") || document.querySelector(".page-container");
  
  let width = window.innerWidth;
  let height = window.innerHeight;

  // 1. Initialize Physics Engine
  const engine = Engine.create({
    gravity: { x: 0, y: 0.8 }
  });

  // 2. Setup Canvas Renderer
  const render = Render.create({
    element: container,
    engine: engine,
    options: {
      width: width,
      height: height,
      wireframes: false,
      background: "transparent"
    }
  });

  Render.run(render);
  const runner = Runner.create();
  Runner.run(runner, engine);

  // 3. Measure EXACT card edges dynamically
  let cardRect = mainContent ? mainContent.getBoundingClientRect() : { left: (width - 1000) / 2, right: (width + 1000) / 2 };

  // Inner walls align directly with card boundaries (with 10px buffer)
  const leftEdge = Math.max(20, cardRect.left - 10);
  const rightEdge = Math.min(width - 20, cardRect.right + 10);
  const thickness = 50;

  const hiddenWallOptions = { 
    isStatic: true, 
    render: { visible: false } 
  };

  // Floors for left and right drop zones
  const floorLeft = Bodies.rectangle(
    leftEdge / 2, 
    height - 2,
    leftEdge, 
    thickness, 
    hiddenWallOptions
  );

  const floorRight = Bodies.rectangle(
    rightEdge + (width - rightEdge) / 2, 
    height - 2, 
    width - rightEdge, 
    thickness, 
    hiddenWallOptions
  );

  // Side Walls
  const outerWallLeft = Bodies.rectangle(-thickness / 2, height / 2, thickness, height * 2, hiddenWallOptions);
  const innerWallLeft = Bodies.rectangle(leftEdge - thickness / 2, height / 2, thickness, height * 2, hiddenWallOptions);
  const innerWallRight = Bodies.rectangle(rightEdge + thickness / 2, height / 2, thickness, height * 2, hiddenWallOptions);
  const outerWallRight = Bodies.rectangle(width + thickness / 2, height / 2, thickness, height * 2, hiddenWallOptions);

  Composite.add(engine.world, [
    floorLeft, 
    floorRight, 
    outerWallLeft, 
    innerWallLeft, 
    innerWallRight, 
    outerWallRight
  ]);

  // 4. Create Skill Balls
  const skills = ["Python", "JavaScript", "React", "TypeScript", "SQL", "C++", "Django", "Git", "Math Logic", "HTML/CSS", "wordpress", "Node.js", "REST APIs", "Data", "Algorithms", "Agile", "Linux", "WIX", "AI", "ML", "Figma", "SEO", "UI/UX", "VMware"];
  const balls = [];
  const radius = 55; // Slightly adjusted so 60px balls fit comfortably in side margins

  skills.forEach((skill, index) => {
    const isLeft = index % 2 === 0;
    
    // Spawn X strictly bounded between screen edge and card edge
    let spawnX;
    if (isLeft) {
      const minX = radius + 5;
      const maxX = Math.max(minX + 10, leftEdge - radius - 5);
      spawnX = Math.random() * (maxX - minX) + minX;
    } else {
      const minX = rightEdge + radius + 5;
      const maxX = Math.max(minX + 10, width - radius - 5);
      spawnX = Math.random() * (maxX - minX) + minX;
    }

    const spawnY = -60 - (index * 80); // Drop sequence above screen

    const ball = Bodies.circle(spawnX, spawnY, radius, {
      restitution: 0.5,
      friction: 0.2,
      density: 0.002,
      render: {
        fillStyle: "#f4e8dc",
        strokeStyle: "rgba(180, 140, 120, 0.4)",
        lineWidth: 3
      }
    });

    ball.skillName = skill;
    balls.push(ball);
  });

  Composite.add(engine.world, balls);

  // 5. Render Monospace Labels Inside Skill Balls
  Events.on(render, "afterRender", () => {
    const ctx = render.context;
    ctx.font = "bold 18px Courier Prime, monospace";
    ctx.fillStyle = "#4a3b32";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    balls.forEach(ball => {
      ctx.save();
      ctx.translate(ball.position.x, ball.position.y);
      ctx.rotate(ball.angle);
      ctx.fillText(ball.skillName, 0, 0);
      ctx.restore();
    });
  });

  // 6. Interactive Dragging
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  });

  Composite.add(engine.world, mouseConstraint);
  render.mouse = mouse;

  // 7. Scroll Behavior
  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const deltaY = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    if (Math.abs(deltaY) > 1) {
      balls.forEach(ball => {
        Body.applyForce(ball, ball.position, {
          x: (Math.random() - 0.5) * 0.001,
          y: -deltaY * 0.00015
        });
      });
    }
  });

  // 8. Dynamic Resize Handler
  window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    render.canvas.width = width;
    render.canvas.height = height;
  });
});