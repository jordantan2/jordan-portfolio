document.addEventListener("DOMContentLoaded", () => {
  const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Body } = Matter;

  const container = document.getElementById("skills-physics-container");
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

  // 3. Define Boundaries with Fallbacks for Small/Medium Screens
  const contentWidth = 1000; // Adjusted zone width
  const thickness = 60;
  
 // Left column extends from 0 to the card edge
  const leftContainerLeft = 0;
  const leftContainerRight = Math.max(80, (width - contentWidth) / 2);
  
  // Right column extends from card edge to full screen width
  const rightContainerLeft = Math.min(width - 80, (width + contentWidth) / 2);
  const rightContainerRight = width;

  const hiddenWallOptions = { 
    isStatic: true, 
    render: { visible: false } 
  };

  // Floors raised slightly (height - 10) so balls sit completely inside the viewport
  const floorLeft = Bodies.rectangle(
    leftContainerRight / 2, 
    height - 10,
    leftContainerRight, 
    thickness, 
    hiddenWallOptions
  );

  const floorRight = Bodies.rectangle(
    rightContainerLeft + (width - rightContainerLeft) / 2, 
    height - 10, 
    width - rightContainerLeft, 
    thickness, 
    hiddenWallOptions
  );

  // Side Walls
  const outerWallLeft = Bodies.rectangle(-thickness / 2, height / 2, thickness, height * 2, hiddenWallOptions);
  const innerWallLeft = Bodies.rectangle(leftContainerRight + thickness / 2, height / 2, thickness, height * 2, hiddenWallOptions);
  const innerWallRight = Bodies.rectangle(rightContainerLeft - thickness / 2, height / 2, thickness, height * 2, hiddenWallOptions);
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
  const skills = ["Python", "React", "TypeScript", "SQL", "C++", "Django", "Git", "Math Logic", "HTML/CSS"];
  const balls = [];
  const radius = 60;

  skills.forEach((skill, index) => {
    const isLeft = index % 2 === 0;
    
    // Calculate spawn positions strictly inside side bounds
    const minX = isLeft ? radius + 10 : rightContainerLeft + radius;
    const maxX = isLeft ? leftContainerRight - radius : width - radius - 10;
    
    // Fallback if margin is tight
    const spawnX = maxX > minX ? Math.random() * (maxX - minX) + minX : (isLeft ? 50 : width - 50);
    const spawnY = -60 - (index * 70); // Drop sequence above screen

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
    ctx.font = "bold 20px Courier Prime, monospace";
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