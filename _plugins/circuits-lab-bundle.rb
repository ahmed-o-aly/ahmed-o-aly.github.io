require "fileutils"

# Copy the built WebXR app unchanged, after Jekyll has rendered the Works page.
Jekyll::Hooks.register :site, :post_write do |site|
  source = File.join(site.source, "assets/apps/circuits-lab")
  destination = File.join(site.dest, "circuits-lab")
  unless File.file?(File.join(source, "index.html"))
    raise "Circuits Lab bundle is missing. Run npm run build:circuits-lab."
  end

  FileUtils.rm_rf(destination)
  FileUtils.mkdir_p(destination)
  FileUtils.cp_r(Dir.glob(File.join(source, "*")), destination)
end
