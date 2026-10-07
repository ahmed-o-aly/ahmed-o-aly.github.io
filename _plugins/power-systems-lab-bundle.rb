require "fileutils"

# Preserve the built module and compressed geometry bytes after Jekyll minification.
Jekyll::Hooks.register :site, :post_write do |site|
  source = File.join(site.source, "assets/apps/power-systems-lab")
  destination = File.join(site.dest, "power-systems-lab")
  unless File.file?(File.join(source, "index.html"))
    raise "Power Systems Lab bundle is missing. Run npm run build:power-systems-lab."
  end
  FileUtils.rm_rf(destination)
  FileUtils.mkdir_p(destination)
  FileUtils.cp_r(Dir.glob(File.join(source, "*")), destination)
end
