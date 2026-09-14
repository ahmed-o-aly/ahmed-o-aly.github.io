require "fileutils"

# Copy the committed Vite bundle after Jekyll's minifiers finish. Module URLs,
# worker code, lazy chunks and local fonts must preserve their compiled bytes.
Jekyll::Hooks.register :site, :post_write do |site|
  source = File.join(site.source, "assets/apps/uae-economy-lab")
  destination = File.join(site.dest, "uae-economy-lab")
  unless File.file?(File.join(source, "index.html"))
    raise "UAE Economy Lab bundle is missing. Run npm run build:uae-economy."
  end

  FileUtils.rm_rf(destination)
  FileUtils.mkdir_p(destination)
  FileUtils.cp_r(Dir.glob(File.join(source, "*")), destination)
end
