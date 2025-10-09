interface CTASectionProps {
  title?: string;
}

export default function CTASection({ title = "An elite group of award-winning artists\nall under one 'Virtual Roof'" }: CTASectionProps) {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="row">
          <div className="text-center mb-16">
            <h6 className="display_h6">
              {title.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < title.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h6>
          </div>
        </div>
      </div>
    </section>
  );
}
