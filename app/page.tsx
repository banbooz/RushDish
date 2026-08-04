"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type DemoItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  tag: string;
};

type OrderStage = "building" | "received" | "cooking" | "ready" | "complete";

const demoItems: DemoItem[] = [
  {
    id: "smash",
    name: "Double Smash",
    description: "Two patties, house sauce, pickles",
    price: 11.5,
    tag: "Bestseller",
  },
  {
    id: "fries",
    name: "Loaded Fries",
    description: "Crispy onions, cheese sauce, jalapeño",
    price: 6.5,
    tag: "Veggie",
  },
  {
    id: "corn",
    name: "Charred Corn Bowl",
    description: "Lime rice, black beans, smoky salsa",
    price: 9.5,
    tag: "Vegan",
  },
  {
    id: "lemonade",
    name: "Festival Lemonade",
    description: "Fresh lemon, mint, sparkling water",
    price: 3.5,
    tag: "Cold",
  },
];

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
});

function QRMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`qr-mark${compact ? " qr-mark--compact" : ""}`} aria-hidden="true" />
  );
}

function Brand() {
  return (
    <span className="brand-lockup" role="img" aria-label="RushDish">
      <img
        className="brand-logo"
        src="/rushdish-mascot.png"
        alt=""
        width={64}
        height={64}
      />
    </span>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoTab, setDemoTab] = useState<"guest" | "crew">("guest");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [orderStage, setOrderStage] = useState<OrderStage>("building");
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);

  const cartRows = useMemo(
    () =>
      demoItems
        .map((item) => ({ ...item, quantity: cart[item.id] ?? 0 }))
        .filter((item) => item.quantity > 0),
    [cart],
  );

  const cartCount = cartRows.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartRows.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const canEditOrder = orderStage === "building";

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setDemoModalOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    if (!demoModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [demoModalOpen]);

  const addItem = (id: string) => {
    if (!canEditOrder) return;
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
  };

  const changeQuantity = (id: string, delta: number) => {
    if (!canEditOrder) return;
    setCart((current) => {
      const nextQuantity = Math.max(0, (current[id] ?? 0) + delta);
      const next = { ...current };
      if (nextQuantity === 0) delete next[id];
      else next[id] = nextQuantity;
      return next;
    });
  };

  const sendDemoOrder = () => {
    if (!cartCount) return;
    setOrderStage("received");
    setDemoTab("crew");
  };

  const advanceOrder = () => {
    setOrderStage((stage) => {
      if (stage === "received") return "cooking";
      if (stage === "cooking") return "ready";
      if (stage === "ready") return "complete";
      return stage;
    });
  };

  const resetDemo = () => {
    setCart({});
    setOrderStage("building");
    setDemoTab("guest");
  };

  const openDemoRequest = () => {
    setFormSent(false);
    setDemoModalOpen(true);
    setMenuOpen(false);
  };

  const submitDemoRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSent(true);
  };

  const stageLabel: Record<OrderStage, string> = {
    building: "Build your order",
    received: "Order received",
    cooking: "On the grill",
    ready: "Ready to collect",
    complete: "Handed off",
  };

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <a className="brand-link" href="#top" onClick={() => setMenuOpen(false)}>
          <Brand />
        </a>
        <nav className={`nav-links${menuOpen ? " nav-links--open" : ""}`} aria-label="Main navigation">
          <a href="#product" onClick={() => setMenuOpen(false)}>Product</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#live-demo" onClick={() => setMenuOpen(false)}>Live demo</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
          <button className="button button--dark nav-cta" type="button" onClick={openDemoRequest}>
            Start an event
          </button>
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </header>

      <main id="main-content">
        <section className="hero" id="top">
          <div className="hero-orb hero-orb--one" aria-hidden="true" />
          <div className="hero-orb hero-orb--two" aria-hidden="true" />
          <div className="hero-copy reveal">
            <p className="eyebrow"><span className="live-dot" /> QR ordering for food trucks</p>
            <h1>Feed the crowd.<br /><span>Lose the queue.</span></h1>
            <p className="hero-subtitle">
              Guests scan, order and pay from their phones. Your crew gets one clear live queue—built for festivals, markets and the rush that arrives all at once.
            </p>
            <div className="hero-actions">
              <button className="button button--dark button--large" type="button" onClick={openDemoRequest}>
                Start your first event <span aria-hidden="true">↗</span>
              </button>
              <a className="button button--light button--large" href="#live-demo">
                Try the live demo <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="trust-line"><span>No guest app</span><span>Reusable QR codes</span><span>Pause orders anytime</span></p>
          </div>

          <div className="hero-stage" aria-label="RushDish order dashboard preview">
            <div className="dashboard-bar">
              <div className="dashboard-brand"><span>RD</span> Firebird Kitchen</div>
              <div className="dashboard-event"><span className="live-dot" /> Riverlight Festival · East Gate</div>
              <div className="dashboard-avatar">FK</div>
            </div>
            <div className="dashboard-body">
              <aside className="dashboard-sidebar" aria-label="Preview navigation">
                <span className="sidebar-active">Orders <b>10</b></span>
                <span>Menu</span>
                <span>Events</span>
                <span>Insights</span>
                <span className="sidebar-spacer" />
                <span>Rush controls</span>
              </aside>
              <div className="queue-board">
                <div className="queue-heading">
                  <div><span className="mini-label">SAT 18 JUL</span><h2>East Gate · Live</h2></div>
                  <div className="rush-pill">Busy · 14 min</div>
                </div>
                <div className="queue-columns">
                  <div className="queue-column">
                    <div className="column-title"><span>Waiting</span><b>5</b></div>
                    <div className="order-card order-card--accent">
                      <div><b>E47</b><span>2 min</span></div>
                      <p>1× Double Smash</p><p>1× Loaded Fries</p>
                      <button type="button" tabIndex={-1}>Start order</button>
                    </div>
                    <div className="order-card order-card--muted"><div><b>E48</b><span>1 min</span></div><p>2× Corn Bowl</p></div>
                  </div>
                  <div className="queue-column">
                    <div className="column-title"><span>Cooking</span><b>3</b></div>
                    <div className="order-card"><div><b>E44</b><span>7 min</span></div><p>2× Double Smash</p><p className="item-note">No pickles · extra sauce</p><button type="button" tabIndex={-1}>Mark ready</button></div>
                  </div>
                  <div className="queue-column">
                    <div className="column-title"><span>Ready</span><b>2</b></div>
                    <div className="order-card order-card--ready"><div><b>E41</b><span>12 min</span></div><strong>READY</strong><button type="button" tabIndex={-1}>Handed off</button></div>
                  </div>
                </div>
              </div>
              <div className="hero-phone" aria-label="Customer menu preview">
                <div className="phone-speaker" />
                <div className="phone-top"><span>9:41</span><span>● ◒</span></div>
                <div className="truck-photo"><span>Perrett&amp;Thompson</span><small>SMASH · SIZZLE · SERVE</small></div>
                <div className="phone-content">
                  <div className="phone-status"><span className="live-dot" /> Accepting orders <b>~14 min</b></div>
                  <p className="phone-eyebrow">Riverlight · East Gate</p>
                  <h3>Firebird Kitchen</h3>
                  <div className="phone-item"><span><b>Double Smash</b><small>House sauce, pickles</small></span><button type="button" tabIndex={-1}>+</button></div>
                  <div className="phone-item"><span><b>Loaded Fries</b><small>Cheese, crispy onions</small></span><button type="button" tabIndex={-1}>+</button></div>
                  <div className="phone-cart">View order <b>2 · £18.00</b></div>
                </div>
              </div>
              <div className="hero-qr-card">
                <QRMark />
                <div><b>Skip the queue</b><span>Scan · Order · Collect</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="ticker" aria-label="RushDish is built for">
          <div className="ticker-track">
            <span>FOOD TRUCKS</span><i>✦</i><span>FESTIVALS</span><i>✦</i><span>FAN ZONES</span><i>✦</i><span>MARKET STALLS</span><i>✦</i><span>POP-UPS</span><i>✦</i><span>EVENT BARS</span><i>✦</i>
            <span aria-hidden="true">FOOD TRUCKS</span><i aria-hidden="true">✦</i><span aria-hidden="true">FESTIVALS</span><i aria-hidden="true">✦</i><span aria-hidden="true">FAN ZONES</span><i aria-hidden="true">✦</i><span aria-hidden="true">MARKET STALLS</span><i aria-hidden="true">✦</i>
          </div>
        </section>

        <section className="problem-section section" id="product">
          <div className="section-heading section-heading--wide">
            <p className="eyebrow">The queue isn’t the experience</p>
            <h2>Your best moments shouldn’t happen in a line.</h2>
            <p>A long queue slows service, pulls the crew away from the grill and loses the next order before it reaches the hatch.</p>
          </div>
          <div className="problem-grid">
            <article className="problem-card problem-card--lime">
              <span className="card-number">01</span>
              <div className="queue-people" aria-hidden="true"><i /><i /><i /><i /><i /></div>
              <h3>Guests leave the moment</h3>
              <p>Nobody came to a festival to watch the back of someone else’s jacket for twenty minutes.</p>
            </article>
            <article className="problem-card">
              <span className="card-number">02</span>
              <div className="sound-wave" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
              <h3>The hatch gets noisy</h3>
              <p>Taking payments and shouting collection numbers pulls your team away from making food.</p>
            </article>
            <article className="problem-card problem-card--dark">
              <span className="card-number">03</span>
              <div className="sold-out-chip">LOADED FRIES <b>SOLD OUT</b></div>
              <h3>Sold out means now</h3>
              <p>Switch an item off once and every guest sees the update before they reach checkout.</p>
            </article>
          </div>
        </section>

        <section className="statement-section section">
          <p className="eyebrow">Not just another QR menu</p>
          <h2><span className="strike">Scan to browse.</span><br />Scan to <em>served.</em></h2>
          <p>A static QR puts a menu on a phone. RushDish connects ordering, payment, preparation, status and pickup.</p>
        </section>

        <section className="demo-section" id="live-demo">
          <div className="demo-intro">
            <p className="eyebrow eyebrow--light">Hands-on product demo</p>
            <h2>See the whole rush in one screen.</h2>
            <p>Build a guest order, send it to the kitchen, then move it through the crew queue. Nothing here charges a card.</p>
            <ol className="demo-instructions">
              <li><span>1</span>Add an item</li>
              <li><span>2</span>Send the test order</li>
              <li><span>3</span>Move it to ready</li>
            </ol>
          </div>
          <div className="demo-workspace">
            <div className="demo-toolbar">
              <div className="demo-tabs" role="tablist" aria-label="Demo view">
                <button type="button" role="tab" aria-selected={demoTab === "guest"} onClick={() => setDemoTab("guest")}>Guest view</button>
                <button type="button" role="tab" aria-selected={demoTab === "crew"} onClick={() => setDemoTab("crew")}>Crew view</button>
              </div>
              <span className="demo-mode"><span className="live-dot" /> DEMO MODE</span>
            </div>

            {demoTab === "guest" ? (
              <div className="guest-demo" role="tabpanel" aria-label="Guest ordering demo">
                <div className="guest-menu-head">
                  <div><p>RIVERLIGHT · EAST GATE</p><h3>Firebird Kitchen</h3></div>
                  <span><i className="live-dot" /> Accepting orders<br /><b>Ready in ~14 min</b></span>
                </div>

                {orderStage === "building" ? (
                  <>
                    <div className="demo-menu-grid">
                      {demoItems.map((item, index) => (
                        <article className="demo-menu-item" key={item.id}>
                          <div className={`food-thumb food-thumb--${index + 1}`} aria-hidden="true"><span>{index === 0 ? "SMASH" : index === 1 ? "FRIES" : index === 2 ? "BOWL" : "COLD"}</span></div>
                          <div className="demo-item-copy"><span className="item-tag">{item.tag}</span><h4>{item.name}</h4><p>{item.description}</p><b>{money.format(item.price)}</b></div>
                          <button className="add-button" type="button" onClick={() => addItem(item.id)} aria-label={`Add ${item.name} to demo order`}>+</button>
                        </article>
                      ))}
                    </div>
                    <div className="demo-cart" aria-live="polite">
                      <div>
                        <span>{cartCount ? `${cartCount} item${cartCount === 1 ? "" : "s"}` : "Your test order is empty"}</span>
                        {cartRows.map((item) => (
                          <div className="cart-row" key={item.id}>
                            <span>{item.name}</span>
                            <span className="quantity-control">
                              <button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}>−</button>
                              <b>{item.quantity}</b>
                              <button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Add one more ${item.name}`}>+</button>
                            </span>
                          </div>
                        ))}
                      </div>
                      <button className="button button--lime" type="button" disabled={!cartCount} onClick={sendDemoOrder}>
                        {cartCount ? `Send test order · ${money.format(cartTotal)}` : "Add something tasty"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className={`order-confirmation order-confirmation--${orderStage}`} aria-live="polite">
                    <div className="confirmation-code">D42</div>
                    <p className="eyebrow">Demo order</p>
                    <h3>{stageLabel[orderStage]}</h3>
                    <p>{orderStage === "ready" ? "Show this screen at the East Gate hatch." : orderStage === "complete" ? "That’s the whole flow—from scan to handoff." : "Keep this page open. The crew status updates here."}</p>
                    <div className="status-track" aria-label={`Order status: ${stageLabel[orderStage]}`}>
                      {(["received", "cooking", "ready"] as OrderStage[]).map((stage, index) => {
                        const stageOrder = ["received", "cooking", "ready", "complete"];
                        const active = stageOrder.indexOf(orderStage) >= index;
                        return <span className={active ? "status-step status-step--active" : "status-step"} key={stage}>{stage === "received" ? "Received" : stage === "cooking" ? "Cooking" : "Ready"}</span>;
                      })}
                    </div>
                    <div className="confirmation-actions">
                      <button className="button button--light" type="button" onClick={() => setDemoTab("crew")}>Open crew view</button>
                      {orderStage === "complete" && <button className="text-button" type="button" onClick={resetDemo}>Restart demo</button>}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="crew-demo" role="tabpanel" aria-label="Crew queue demo">
                <div className="crew-head">
                  <div><p className="mini-label">SAT 18 JUL</p><h3>East Gate · Live</h3></div>
                  <div className="crew-metrics"><span><b>{orderStage === "received" ? 1 : 0}</b> Waiting</span><span><b>{orderStage === "cooking" ? 1 : 0}</b> Cooking</span><span><b>{orderStage === "ready" ? 1 : 0}</b> Ready</span></div>
                  <button className="rush-control-button" type="button">Busy · 14 min</button>
                </div>
                {orderStage === "building" ? (
                  <div className="crew-empty"><span>✓</span><h4>All caught up.</h4><p>Build an order in Guest view, then send it here.</p><button className="button button--light" type="button" onClick={() => setDemoTab("guest")}>Build a test order</button></div>
                ) : orderStage === "complete" ? (
                  <div className="crew-empty crew-empty--complete"><span>✦</span><h4>D42 handed off. Nice work.</h4><p>The order has moved into today’s completed total.</p><button className="button button--lime" type="button" onClick={resetDemo}>Restart demo</button></div>
                ) : (
                  <div className="live-order-layout">
                    <div className={`live-order-card live-order-card--${orderStage}`}>
                      <div className="live-order-top"><span className="order-code">D42</span><span className="paid-chip">PAID DEMO</span><span className="order-age">just now</span></div>
                      <p className="order-total">{cartCount} items · {money.format(cartTotal)}</p>
                      <div className="live-order-items">
                        {cartRows.map((item) => <p key={item.id}><b>{item.quantity}×</b> {item.name}{item.id === "smash" && <small>No pickles · extra house sauce</small>}</p>)}
                      </div>
                      <button className="button button--lime order-action" type="button" onClick={advanceOrder}>
                        {orderStage === "received" ? "Start cooking" : orderStage === "cooking" ? "Mark ready" : "Complete pickup"} <span aria-hidden="true">→</span>
                      </button>
                    </div>
                    <div className="crew-side-note">
                      <span className="side-note-icon">↻</span>
                      <h4>Now switch views</h4>
                      <p>The guest screen reflects every crew action—no shouting over the music.</p>
                      <button className="text-button text-button--light" type="button" onClick={() => setDemoTab("guest")}>Check guest status →</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="steps-section section" id="how-it-works">
          <div className="section-heading">
            <p className="eyebrow">From sign to served</p>
            <h2>Five small steps.<br />One smoother service.</h2>
          </div>
          <div className="steps-list">
            {[
              ["01", "Scan", "Open the right truck instantly", "A permanent truck QR or an event-specific code opens the correct menu and pickup point."],
              ["02", "Order", "Make every choice clear", "Guests browse, choose modifiers and see sold-out items before reaching checkout."],
              ["03", "Pay", "Pay before the hatch", "Card and mobile-wallet checkout happens on the guest’s phone, away from the service window."],
              ["04", "Prepare", "One queue, in the right order", "Paid orders arrive with items, notes, status and time waiting in one calm crew view."],
              ["05", "Collect", "Ready means ready", "The order page updates with a bold pickup code that is easy to spot at the hatch."],
            ].map(([number, label, title, copy]) => (
              <article className="step-row" key={number}>
                <span className="step-number">{number}</span><span className="step-label">{label}</span><h3>{title}</h3><p>{copy}</p><span className="step-arrow" aria-hidden="true">↘</span>
              </article>
            ))}
          </div>
        </section>

        <section className="qr-scan-section section" id="scan-qr">
          <div className="qr-scan-copy">
            <p className="eyebrow">Quick to scan</p>
            <h2>Scan once.<br />Menu open.</h2>
            <p>A quick phone scan takes guests straight to your live menu—no searching, typing or app needed. They can browse, order and pay in seconds while your crew keeps serving.</p>
            <div className="qr-scan-steps" aria-label="How QR ordering works">
              <span><b>1</b> Point the camera</span>
              <span><b>2</b> Tap the link</span>
              <span><b>3</b> Menu opens</span>
            </div>
          </div>
          <div className="qr-scan-preview">
            <div className="print-card">
              <span className="print-card-label">SCAN TO ORDER</span>
              <QRMark />
              <div className="print-card-copy"><Brand /><p>SCAN · MENU · ORDER</p></div>
            </div>
            <div className="scan-ready-badge"><span>✓</span><div><b>Menu opens instantly</b><small>No app or account needed</small></div></div>
          </div>
        </section>

        <section className="rush-control-section section">
          <div className="rush-copy">
            <p className="eyebrow">Rush control</p>
            <h2>When the field fills up, stay in control.</h2>
            <p>Change the pace without rebuilding the menu. Extend the estimate, limit incoming orders, pause checkout or sell out one item in a tap.</p>
            <p className="feature-kicker">Control demand before demand controls the truck.</p>
          </div>
          <div className="control-panel">
            <div className="control-panel-top"><div><span className="mini-label">EAST GATE</span><h3>Rush controls</h3></div><span className="status-live"><i className="live-dot" /> LIVE</span></div>
            <div className="control-row"><span><b>Accepting orders</b><small>Existing orders stay visible if paused</small></span><button className="toggle toggle--on" type="button" aria-label="Accepting orders preview is on"><i /></button></div>
            <div className="control-row"><span><b>Pickup estimate</b><small>Shown before checkout</small></span><div className="stepper"><button type="button" tabIndex={-1}>−</button><b>14 min</b><button type="button" tabIndex={-1}>+</button></div></div>
            <div className="control-block"><span><b>Rush mode</b><small>Adjust the pace in one tap</small></span><div className="segmented"><button type="button">Normal</button><button className="selected" type="button">Busy</button><button type="button">Maxed</button></div></div>
            <div className="control-toast"><span>✓</span><div><b>Loaded Fries marked sold out</b><small>Guests can no longer add this item.</small></div></div>
          </div>
        </section>

        <section className="features-section section">
          <div className="section-heading section-heading--wide">
            <p className="eyebrow">The whole service, connected</p>
            <h2>Everything the rush needs. Nothing it doesn’t.</h2>
          </div>
          <div className="features-grid">
            {[
              ["LIVE", "Live menu", "Update prices, modifiers, dietary labels and availability without replacing the QR."],
              ["QUEUE", "Kitchen queue", "Run service from a tablet or laptop with clear waiting, cooking and ready states."],
              ["EVENT", "Event workspaces", "Reuse a menu and create a separate QR for each pitch or service window."],
              ["OFF", "Instant sell-outs", "Hide an item or just the unavailable size, flavour or modifier in one move."],
              ["14m", "Pickup estimates", "Show guests an honest wait and adjust it as the kitchen gets busier."],
              ["↗", "Order insights", "Review sales, item mix, busiest periods and order timings after service."],
            ].map(([icon, title, copy], index) => (
              <article className={`feature-card feature-card--${index + 1}`} key={title}><span className="feature-icon">{icon}</span><h3>{title}</h3><p>{copy}</p></article>
            ))}
          </div>
        </section>

        <section className="reliability-section section">
          <div className="reliability-copy">
            <p className="eyebrow eyebrow--light">Festival reality</p>
            <h2>Built for a field,<br />not an office.</h2>
            <p>Festival connections get crowded. RushDish keeps the guest journey lightweight and the crew view focused, with clear connection states if a device drops offline.</p>
            <div className="reliability-note"><span>!</span><p>Guests and crew devices still need internet access. A dedicated hotspot is recommended for busy events.</p></div>
          </div>
          <div className="signal-card">
            <div className="signal-sky"><span className="signal-moon" /><i className="signal-line signal-line--1" /><i className="signal-line signal-line--2" /><i className="signal-line signal-line--3" /></div>
            <div className="connection-panel">
              <div className="connection-top"><span>CONNECTION STATUS</span><b><i className="live-dot" /> Online</b></div>
              <div className="connection-item"><span className="connection-icon">↻</span><div><b>Orders are up to date</b><small>Last checked just now</small></div><span className="check">✓</span></div>
              <div className="connection-item"><span className="connection-icon">▥</span><div><b>Kitchen queue synced</b><small>10 open orders on this device</small></div><span className="check">✓</span></div>
            </div>
          </div>
        </section>

        <section className="pricing-section section" id="pricing">
          <div className="pricing-heading">
            <div><p className="eyebrow">Estimated pricing</p><h2>Clear costs. No cut of your sales.</h2><p>Indicative pricing for one-off events or a full season. RushDish charges 0% platform fees and 0% commission fees. Payment-provider fees and VAT are separate.</p></div>
          </div>
          <div className="pricing-grid">
            <article className="price-card">
              <span className="price-label">POP-UP</span><h3>One event day</h3><div className="price"><strong>£200</strong><span>/ event day<br /><b>0% platform fee</b><br /><b>0% commission fee</b></span></div><p>For occasional markets and one-off events.</p>
              <ul><li>1 truck and active event</li><li>QR menu and checkout</li><li>Live kitchen queue</li><li>Rush controls</li><li>Sales summary</li></ul>
              <button className="button button--light button--full" type="button" onClick={openDemoRequest}>Run one event</button>
            </article>
            <article className="price-card price-card--featured">
              <span className="recommended-badge">RECOMMENDED</span><span className="price-label">ROAMER</span><h3>All season</h3><div className="price"><strong>£20</strong><span>/ month<br /><b>+ £500 upfront build cost</b><br /><b>0% platform & commission fees</b></span></div><p>For regular traders who want a higher-quality, custom-designed ordering experience.</p>
              <ul><li>Higher-quality menu and QR design</li><li>Custom season-ready build</li><li>Unlimited event workspaces</li><li>Up to 5 crew members</li><li>Live item availability</li></ul>
              <button className="button button--lime button--full" type="button" onClick={openDemoRequest}>Start roaming</button>
            </article>
            <article className="price-card">
              <span className="price-label">FLEET</span><h3>Several service points</h3><div className="price"><strong>Custom estimate</strong></div><p>For operators running multiple trucks or pitches, with 0% platform and commission fees.</p>
              <ul><li>Multiple trucks</li><li>Central event overview</li><li>Location-specific menus</li><li>Roles and permissions</li><li>Guided setup</li></ul>
              <button className="button button--light button--full" type="button" onClick={openDemoRequest}>Talk to us</button>
            </article>
          </div>
          <p className="pricing-note">Estimated prices only. No platform fees. No commission fees. Payment-provider fees and VAT may apply.</p>
        </section>

        <section className="faq-section section" id="faq">
          <div className="faq-heading"><p className="eyebrow">Before you scan</p><h2>Good questions.<br />Straight answers.</h2><p>Everything you need to know before your first event.</p></div>
          <div className="faq-list">
            {[
              ["Do guests need to download an app?", "No. Scanning the QR opens the right menu in the phone’s browser. Guests browse, order, pay and follow their status there."],
              ["What equipment does my crew need?", "A modern tablet or laptop with an internet connection is enough to run the kitchen queue. Your existing card terminal can stay for walk-up orders."],
              ["Will it work with weak festival signal?", "The pages are designed to stay lightweight and show clear reconnection states, but guests and crew still need internet access. We recommend a dedicated 4G or 5G hotspot for busy events."],
              ["What happens when an item sells out?", "Switch it off from the crew or owner view. It becomes unavailable on the guest menu while existing paid orders remain in the queue."],
              ["Can I slow down incoming orders?", "Yes. Increase the displayed pickup estimate, cap orders within a time window or pause new checkout while the crew catches up."],
              ["Can I reuse the same QR code?", "Yes. A permanent truck QR can always point to your current service, while event-specific codes keep separate pitches and queues organised."],
              ["Does RushDish manage allergen compliance?", "RushDish provides fields for ingredients, dietary labels and allergen information. The operator remains responsible for keeping that information accurate and meeting local requirements."],
            ].map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}
          </div>
        </section>

        <section className="final-cta section">
          <div className="final-qr"><QRMark /><span>SCAN<br />ORDER<br />COLLECT</span></div>
          <p className="eyebrow eyebrow--light">Built for the rush</p>
          <h2>Open the hatch.<br /><span>Let orders come to you.</span></h2>
          <p>Set up your menu, print the QR and run your next service from one clear queue.</p>
          <div className="hero-actions"><button className="button button--lime button--large" type="button" onClick={openDemoRequest}>Start your first event <span aria-hidden="true">↗</span></button><a className="button button--ghost button--large" href="#live-demo">Try the live demo</a></div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand"><Brand /><p>QR ordering, preparation and pickup for food trucks and event kitchens.</p></div>
        <div className="footer-links"><div><b>Product</b><a href="#product">Overview</a><a href="#how-it-works">How it works</a><a href="#live-demo">Live demo</a><a href="#pricing">Pricing</a></div><div><b>Company</b><button type="button" onClick={openDemoRequest}>Contact</button><a href="#faq">FAQ</a><span>Built in the UK</span></div></div>
      </footer>

      {demoModalOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDemoModalOpen(false); }}>
          <section className="demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title">
            <button className="modal-close" type="button" aria-label="Close demo request" onClick={() => setDemoModalOpen(false)}>×</button>
            {!formSent ? (
              <>
                <p className="eyebrow">Start an event</p><h2 id="demo-modal-title">Tell us about your next rush.</h2><p>Share the basics and this working concept will show the success flow. No data leaves this browser.</p>
                <form onSubmit={submitDemoRequest}>
                  <label>Your name<input name="name" type="text" autoComplete="name" required autoFocus /></label>
                  <label>Work email<input name="email" type="email" autoComplete="email" required /></label>
                  <label>What do you run?<select name="business" defaultValue=""><option value="" disabled>Choose one</option><option>Food truck</option><option>Festival or event</option><option>Market stall or pop-up</option><option>Event bar</option><option>Multiple locations</option></select></label>
                  <label>Next event (optional)<input name="event" type="text" placeholder="e.g. Riverside Festival, August" /></label>
                  <button className="button button--dark button--full" type="submit">Preview my setup <span aria-hidden="true">→</span></button>
                </form>
                <small className="form-disclaimer">Prototype form: submission is simulated and no personal data is transmitted or stored.</small>
              </>
            ) : (
              <div className="form-success" aria-live="polite"><span>✓</span><p className="eyebrow">Request previewed</p><h2 id="demo-modal-title">You’re ready for the rush.</h2><p>The demo flow works. Connect this form to your inbox or CRM before a real launch.</p><div className="success-summary"><QRMark compact /><div><b>Next step</b><span>Try the live guest-to-kitchen order flow.</span></div></div><button className="button button--dark button--full" type="button" onClick={() => { setDemoModalOpen(false); document.querySelector("#live-demo")?.scrollIntoView({ behavior: "smooth" }); }}>Open the live demo</button></div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
