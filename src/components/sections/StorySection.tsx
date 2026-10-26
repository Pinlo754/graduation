import type { SiteConfig } from "@/config/site";
import { shortHash } from "@/lib/random";
import { SectionHeading } from "../SectionHeading";

const d = (n: number) => ({ "--d": n }) as React.CSSProperties;

export function StorySection({ config }: { config: SiteConfig }) {
  const { graduate, journey } = config;
  const specs = [
    { key: "EDUCATION", value: graduate.university },
    { key: "FIELD", value: graduate.field },
    { key: "MAJOR", value: graduate.major },
    { key: "STATUS", value: "Graduated", accent: true },
  ];
  const commits = [...journey].reverse(); // newest first, like `git log`

  return (
    <section id="story" className="section story" aria-labelledby="story-title">
      <div className="container">
        <SectionHeading
          index="02"
          kicker="the.journey()"
          id="story-title"
          title={
            <>
              Hành trình <em>build</em> một kỹ sư phần mềm
            </>
          }
          lead="Bốn năm compile kiến thức, debug chính mình và merge thật nhiều kỷ niệm — giờ là lúc release phiên bản 1.0."
        />

        <dl className="specs">
          {specs.map((spec, i) => (
            <div key={spec.key} className={`specs__item ${spec.accent ? "specs__item--accent" : ""}`} data-reveal style={d(i)}>
              <dt className="mono">{spec.key}</dt>
              <dd>
                {spec.value}
                {spec.accent && <span className="specs__check" aria-hidden="true"> ✓</span>}
              </dd>
            </div>
          ))}
        </dl>

        <div className="story__grid">
          <div className="editor" data-reveal>
            <div className="editor__bar">
              <span className="editor__dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="editor__file mono">graduate.config.ts</span>
            </div>
            <pre className="editor__code mono" aria-label="Thông tin tốt nghiệp">
              <code>
                <Line n={1}>
                  <K>const</K> <V>graduate</V> = {"{"}
                </Line>
                <Line n={2}>
                  {"  "}name: <S>&quot;{graduate.fullName}&quot;</S>,
                </Line>
                <Line n={3}>
                  {"  "}university: <S>&quot;{graduate.university}&quot;</S>,
                </Line>
                <Line n={4}>
                  {"  "}field: <S>&quot;{graduate.field}&quot;</S>,
                </Line>
                <Line n={5}>
                  {"  "}major: <S>&quot;{graduate.major}&quot;</S>,
                </Line>
                {graduate.studentId && (
                  <Line n={6}>
                    {"  "}studentId: <S>&quot;{graduate.studentId}&quot;</S>,
                  </Line>
                )}
                <Line n={graduate.studentId ? 7 : 6}>
                  {"  "}classOf: <N>{graduate.classOf}</N>,
                </Line>
                <Line n={graduate.studentId ? 8 : 7}>
                  {"  "}status: <S>&quot;GRADUATED&quot;</S>, <C>{"// 🎓 finally"}</C>
                </Line>
                <Line n={graduate.studentId ? 9 : 8}>{"};"}</Line>
              </code>
            </pre>
            <div className="build">
              <p className="build__cmd mono">
                <span className="build__prompt">$</span> npm run graduate
              </p>
              <div className="build__bar" aria-hidden="true">
                <span className="build__fill" />
              </div>
              <ul className="build__log mono">
                <li>✓ {journey.length} milestones compiled</li>
                <li>✓ capstone project passed</li>
                <li className="build__ok">✓ Build completed — ready to ship 🚀</li>
              </ul>
            </div>
          </div>

          <ol className="gitlog" aria-label="Các cột mốc">
            {commits.map((commit, i) => {
              const isHead = i === 0;
              return (
                <li key={`${commit.title}-${i}`} className={`gitlog__item ${isHead ? "gitlog__item--head" : ""}`} data-reveal style={d(i)}>
                  <span className="gitlog__node" aria-hidden="true" />
                  <div className="gitlog__meta mono">
                    <span className="gitlog__hash">{shortHash(commit.title + i)}</span>
                    {isHead && <span className="gitlog__ref">HEAD → main</span>}
                    {commit.type === "release" && <span className="gitlog__tag">tag: v1.0.0</span>}
                    {commit.when && <span className="gitlog__when">{commit.when}</span>}
                  </div>
                  <h3 className="gitlog__title">
                    <span className={`gitlog__type gitlog__type--${commit.type} mono`}>{commit.type}:</span> {commit.title}
                  </h3>
                  {commit.description && <p className="gitlog__desc">{commit.description}</p>}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Line({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <span className="editor__line">
      <span className="editor__ln" aria-hidden="true">
        {n}
      </span>
      {children}
      {"\n"}
    </span>
  );
}
const K = ({ children }: { children: React.ReactNode }) => <span className="tok-k">{children}</span>;
const V = ({ children }: { children: React.ReactNode }) => <span className="tok-v">{children}</span>;
const S = ({ children }: { children: React.ReactNode }) => <span className="tok-s">{children}</span>;
const N = ({ children }: { children: React.ReactNode }) => <span className="tok-n">{children}</span>;
const C = ({ children }: { children: React.ReactNode }) => <span className="tok-c">{children}</span>;
